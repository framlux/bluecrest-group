import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import { parseQboPnl } from "./qbo-parser";

function buildXlsxBuffer(rows: (string | number | null)[][]): ArrayBuffer {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  return buf;
}

describe("QBO Parser — amount parsing", () => {
  it('should parse "(1,234.56)" as -1234.56', () => {
    const buf = buildXlsxBuffer([
      ["Test Company"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Sales", "(1,234.56)"],
    ]);
    const result = parseQboPnl(buf);
    const salesItem = result.items.find((i) => i.subcategory === "Sales");
    expect(salesItem).toBeDefined();
    expect(salesItem!.amount).toBeCloseTo(-1234.56);
  });

  it("should parse an empty cell as 0", () => {
    const buf = buildXlsxBuffer([
      ["Test Company"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Donations", null],
    ]);
    const result = parseQboPnl(buf);
    const item = result.items.find((i) => i.subcategory === "Donations");
    expect(item).toBeDefined();
    expect(item!.amount).toBe(0);
  });

  it('should parse "-" as 0', () => {
    const buf = buildXlsxBuffer([
      ["Test Company"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Other", "-"],
    ]);
    const result = parseQboPnl(buf);
    const item = result.items.find((i) => i.subcategory === "Other");
    expect(item).toBeDefined();
    expect(item!.amount).toBe(0);
  });

  it("should strip dollar signs and commas", () => {
    const buf = buildXlsxBuffer([
      ["Test Company"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Revenue", "$1,234.56"],
    ]);
    const result = parseQboPnl(buf);
    const item = result.items.find((i) => i.subcategory === "Revenue");
    expect(item).toBeDefined();
    expect(item!.amount).toBeCloseTo(1234.56);
  });
});

describe("QBO Parser — metadata extraction", () => {
  it("should treat the first non-empty row as company name", () => {
    const buf = buildXlsxBuffer([
      ["Acme Corp"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Sales", "100"],
    ]);
    const result = parseQboPnl(buf);
    expect(result.metadata.companyName).toBe("Acme Corp");
  });

  it('should detect "Profit and Loss" as the report title', () => {
    const buf = buildXlsxBuffer([
      ["Acme Corp"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Sales", "100"],
    ]);
    const result = parseQboPnl(buf);
    expect(result.metadata.reportTitle).toBe("Profit and Loss");
  });
});

describe("QBO Parser — category hierarchy", () => {
  it("should make Income a category with items underneath as subcategories", () => {
    const buf = buildXlsxBuffer([
      ["Test Company"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Product Sales", "5000"],
      ["Service Revenue", "3000"],
      ["Total Income", "8000"],
    ]);
    const result = parseQboPnl(buf);

    const productSales = result.items.find((i) => i.subcategory === "Product Sales");
    expect(productSales).toBeDefined();
    expect(productSales!.category).toBe("Income");
    expect(productSales!.amount).toBeCloseTo(5000);

    const serviceRevenue = result.items.find((i) => i.subcategory === "Service Revenue");
    expect(serviceRevenue).toBeDefined();
    expect(serviceRevenue!.category).toBe("Income");
  });

  it('should preserve "Total ..." lines as top-level items', () => {
    const buf = buildXlsxBuffer([
      ["Test Company"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Sales", "5000"],
      ["Total Income", "5000"],
    ]);
    const result = parseQboPnl(buf);
    const totalIncome = result.items.find((i) => i.category === "Total Income");
    expect(totalIncome).toBeDefined();
    expect(totalIncome!.subcategory).toBeNull();
  });

  it('should parse "Net Income" with an amount as a standalone line item', () => {
    const buf = buildXlsxBuffer([
      ["Test Company"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Sales", "5000"],
      ["Net Income", "3000"],
    ]);
    const result = parseQboPnl(buf);
    const netIncome = result.items.find((i) => i.category === "Net Income");
    expect(netIncome).toBeDefined();
    expect(netIncome!.subcategory).toBeNull();
    expect(netIncome!.amount).toBeCloseTo(3000);
  });
});

describe("QBO Parser — ordering and edge cases", () => {
  it("should preserve line ordering from the file", () => {
    const buf = buildXlsxBuffer([
      ["Test Company"],
      ["Profit and Loss"],
      ["Jan 2024"],
      ["Income"],
      ["Sales", "5000"],
      ["Services", "3000"],
      ["Total Income", "8000"],
    ]);
    const result = parseQboPnl(buf);
    const orders = result.items.map((i) => i.lineOrder);
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]).toBeGreaterThan(orders[i - 1]);
    }
  });

  it("should return zero items and a warning for an empty file", () => {
    const buf = buildXlsxBuffer([]);
    const result = parseQboPnl(buf);
    expect(result.items.length).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
