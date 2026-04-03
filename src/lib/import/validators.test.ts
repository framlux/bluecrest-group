import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateAmounts, collectWarnings } from "./validators";
import type { ParsedPnlItem } from "./qbo-parser";

// Mock the database module for checkDuplicatePeriod
vi.mock("@/lib/db", () => {
  const mockChain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
  };
  return { db: mockChain };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validateAmounts", () => {
  it("should pass when all amounts are valid numbers", () => {
    const items: ParsedPnlItem[] = [
      { category: "Income", subcategory: "Sales", amount: 1000, lineOrder: 0 },
      { category: "Expenses", subcategory: "Rent", amount: -500, lineOrder: 1 },
    ];
    const result = validateAmounts(items);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail when an item has NaN as its amount", () => {
    const items: ParsedPnlItem[] = [
      { category: "Income", subcategory: "Sales", amount: NaN, lineOrder: 0 },
    ];
    const result = validateAmounts(items);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("collectWarnings", () => {
  it("should produce a warning when more than 5 subcategory items have zero amounts", () => {
    const items: ParsedPnlItem[] = Array.from({ length: 6 }, (_, i) => ({
      category: "Income",
      subcategory: `Item ${i}`,
      amount: 0,
      lineOrder: i,
    }));
    const warnings = collectWarnings(items);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain("zero amounts");
  });

  it("should produce no warnings when 5 or fewer items have zero amounts", () => {
    const items: ParsedPnlItem[] = [
      { category: "Income", subcategory: "Sales", amount: 0, lineOrder: 0 },
      { category: "Income", subcategory: "Other", amount: 1000, lineOrder: 1 },
    ];
    const warnings = collectWarnings(items);
    expect(warnings).toHaveLength(0);
  });

  it("should produce a warning when items array is empty", () => {
    const warnings = collectWarnings([]);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain("No line items");
  });
});
