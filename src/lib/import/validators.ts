import { db } from "@/lib/db";
import { financialPeriods } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { ParsedPnlItem } from "./qbo-parser";

/**
 * Check if a period overlaps with existing periods for this company.
 */
export async function checkDuplicatePeriod(
  companyId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<boolean> {
  const overlapping = await db
    .select({ id: financialPeriods.id })
    .from(financialPeriods)
    .where(
      and(
        eq(financialPeriods.companyId, companyId),
        sql`${financialPeriods.periodStart} < ${periodEnd}`,
        sql`${financialPeriods.periodEnd} > ${periodStart}`
      )
    )
    .limit(1);

  return overlapping.length > 0;
}

/**
 * Validate that all amounts are valid numbers.
 */
export function validateAmounts(
  items: ParsedPnlItem[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const item of items) {
    if (typeof item.amount !== "number" || isNaN(item.amount)) {
      errors.push(
        `Invalid amount for ${item.category}${item.subcategory ? " > " + item.subcategory : ""}`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Collect warnings about parsed data (informational, doesn't block import).
 */
export function collectWarnings(items: ParsedPnlItem[]): string[] {
  const warnings: string[] = [];

  const zeroItems = items.filter((i) => i.amount === 0 && i.subcategory);
  if (zeroItems.length > 5) {
    warnings.push(
      `${zeroItems.length} line items have zero amounts — these may be empty rows from the export.`
    );
  }

  if (items.length === 0) {
    warnings.push("No line items were parsed from the file.");
  }

  return warnings;
}
