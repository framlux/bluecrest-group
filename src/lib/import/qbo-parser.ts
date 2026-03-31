import * as XLSX from "xlsx";

export interface ParsedPnlItem {
  category: string;
  subcategory: string | null;
  amount: number;
  lineOrder: number;
}

export interface ParsedPnlData {
  items: ParsedPnlItem[];
  metadata: {
    reportTitle: string;
    dateRange: string;
    companyName: string;
  };
  warnings: string[];
}

/**
 * Parse a QBO P&L export file (Excel or CSV).
 * Returns structured P&L data with category hierarchy.
 */
export function parseQboPnl(buffer: ArrayBuffer): ParsedPnlData {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert to array of arrays
  const rows: (string | number | null)[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
    raw: false,
  });

  const warnings: string[] = [];
  const items: ParsedPnlItem[] = [];
  let companyName = "";
  let reportTitle = "";
  let dateRange = "";

  // Phase 1: Detect header rows (typically first 3-5 rows)
  let dataStartRow = 0;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    if (!row || row.every((c) => c === null || c === "")) continue;

    const firstCell = String(row[0] ?? "").trim();

    // Company name is usually the first non-empty row
    if (i === 0 && firstCell && !companyName) {
      companyName = firstCell;
      continue;
    }

    // Report title (e.g., "Profit and Loss")
    if (
      !reportTitle &&
      (firstCell.toLowerCase().includes("profit") ||
        firstCell.toLowerCase().includes("p&l") ||
        firstCell.toLowerCase().includes("income statement"))
    ) {
      reportTitle = firstCell;
      continue;
    }

    // Date range row
    if (
      !dateRange &&
      (firstCell.toLowerCase().includes("january") ||
        firstCell.toLowerCase().includes("for the") ||
        firstCell.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/))
    ) {
      dateRange = firstCell;
      continue;
    }

    // If we see a typical header row or data row, mark data start
    if (
      firstCell === "" ||
      firstCell.toLowerCase() === "income" ||
      firstCell.toLowerCase() === "revenue" ||
      firstCell.toLowerCase() === "ordinary income/expense"
    ) {
      dataStartRow = i;
      break;
    }

    // If we've passed 5 rows without finding data, assume data starts here
    if (i >= 4) {
      dataStartRow = i;
      break;
    }
  }

  // Phase 2: Parse data rows
  let currentCategory = "";
  let lineOrder = 0;

  for (let i = dataStartRow; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((c) => c === null || c === "")) continue;

    const label = String(row[0] ?? "").trim();
    if (!label) continue;

    // Find the amount column (usually the last non-empty column)
    let amount = 0;
    let hasAmount = false;
    for (let j = row.length - 1; j >= 1; j--) {
      const cellValue = row[j];
      if (cellValue !== null && cellValue !== "") {
        amount = parseQboAmount(String(cellValue));
        hasAmount = true;
        break;
      }
    }

    // Detect category headers (rows without amounts, or "Total" rows)
    const isTotal = label.toLowerCase().startsWith("total ");
    const isSectionHeader =
      !hasAmount &&
      !isTotal &&
      (label === "Income" ||
        label === "Revenue" ||
        label === "Cost of Goods Sold" ||
        label === "Gross Profit" ||
        label === "Expenses" ||
        label === "Expense" ||
        label === "Other Income" ||
        label === "Other Expense" ||
        label === "Other Income/Expense" ||
        label === "Ordinary Income/Expense" ||
        label === "Net Ordinary Income" ||
        label === "Net Other Income" ||
        label === "Net Income");

    if (isSectionHeader && !hasAmount) {
      currentCategory = label;
      continue;
    }

    // "Net Income" with an amount is the final line
    if (label === "Net Income" || label === "Net Ordinary Income" || label === "Net Other Income") {
      items.push({
        category: label,
        subcategory: null,
        amount,
        lineOrder: lineOrder++,
      });
      continue;
    }

    // Total rows
    if (isTotal) {
      items.push({
        category: label,
        subcategory: null,
        amount,
        lineOrder: lineOrder++,
      });
      continue;
    }

    // Regular line items
    if (currentCategory) {
      items.push({
        category: currentCategory,
        subcategory: label,
        amount,
        lineOrder: lineOrder++,
      });
    } else {
      // No category context — treat as top-level
      items.push({
        category: label,
        subcategory: null,
        amount,
        lineOrder: lineOrder++,
      });
    }
  }

  if (items.length === 0) {
    warnings.push("No data rows were found in the file.");
  }

  return {
    items,
    metadata: {
      companyName: companyName || "Unknown",
      reportTitle: reportTitle || "Profit and Loss",
      dateRange: dateRange || "Unknown",
    },
    warnings,
  };
}

/**
 * Parse a QBO-formatted amount string.
 * Handles: (1,234.56) for negative, 1,234.56, blank = 0
 */
function parseQboAmount(value: string): number {
  if (!value || value.trim() === "" || value.trim() === "-") return 0;

  let cleaned = value.trim();

  // Check for parentheses (negative)
  const isNegative = cleaned.startsWith("(") && cleaned.endsWith(")");
  if (isNegative) {
    cleaned = cleaned.slice(1, -1);
  }

  // Remove commas, dollar signs, spaces
  cleaned = cleaned.replace(/[$,\s]/g, "");

  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;

  return isNegative ? -num : num;
}
