import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: mockAuth }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const mockCheckDuplicate = vi.fn();
const mockValidateAmounts = vi.fn();

vi.mock("@/lib/import/validators", () => ({
  checkDuplicatePeriod: (...args: unknown[]) => mockCheckDuplicate(...args),
  validateAmounts: (...args: unknown[]) => mockValidateAmounts(...args),
}));

const mockParseQbo = vi.fn();
vi.mock("@/lib/import/qbo-parser", () => ({
  parseQboPnl: (...args: unknown[]) => mockParseQbo(...args),
}));

const mockInsertReturning = vi.fn();
const mockInsertValues = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: (...args: unknown[]) => {
        mockInsertValues(...args);
        return {
          returning: (...rArgs: unknown[]) => mockInsertReturning(...rArgs),
        };
      },
    }),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  financialPeriods: Symbol("financialPeriods"),
  pnlLineItems: Symbol("pnlLineItems"),
}));

beforeEach(() => {
  vi.clearAllMocks();
  // Defaults
  mockCheckDuplicate.mockResolvedValue(false);
  mockValidateAmounts.mockReturnValue({ valid: true, errors: [] });
  mockParseQbo.mockReturnValue({
    items: [{ category: "Income", subcategory: "Sales", amount: 1000, lineOrder: 0 }],
    metadata: { reportTitle: "P&L", dateRange: "Jan 2024", companyName: "Test" },
    warnings: [],
  });
  mockInsertReturning.mockResolvedValue([{ id: "period-1" }]);
});

function makeFormData(overrides: Record<string, string | File> = {}) {
  const fd = new FormData();
  fd.set("companyId", overrides.companyId as string ?? "c1");
  fd.set("periodStart", overrides.periodStart as string ?? "2024-01-01");
  fd.set("periodEnd", overrides.periodEnd as string ?? "2024-01-31");
  fd.set("file", overrides.file ?? new File(["data"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  return fd;
}

describe("importFinancialData", () => {
  it("should throw Unauthorized when called by a non-admin", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "client" } });
    const { importFinancialData } = await import("./actions");
    await expect(importFinancialData(makeFormData())).rejects.toThrow("Unauthorized");
  });

  it("should return an error when companyId is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { importFinancialData } = await import("./actions");
    const fd = makeFormData();
    fd.set("companyId", "");
    const result = await importFinancialData(fd);
    expect(result.error).toContain("Company");
  });

  it("should return an error when period dates are missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { importFinancialData } = await import("./actions");
    const fd = makeFormData();
    fd.set("periodStart", "");
    fd.set("periodEnd", "");
    const result = await importFinancialData(fd);
    expect(result.error).toContain("dates");
  });

  it("should return an error when end date is before start date", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { importFinancialData } = await import("./actions");
    const fd = makeFormData({ periodStart: "2024-03-01", periodEnd: "2024-01-01" });
    const result = await importFinancialData(fd);
    expect(result.error).toContain("after");
  });

  it("should return an error when the period overlaps an existing one", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockCheckDuplicate.mockResolvedValue(true);
    const { importFinancialData } = await import("./actions");
    const result = await importFinancialData(makeFormData());
    expect(result.error).toContain("overlap");
  });

  it("should return an error when the parsed file has zero items", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockParseQbo.mockReturnValue({ items: [], metadata: {}, warnings: [] });
    const { importFinancialData } = await import("./actions");
    const result = await importFinancialData(makeFormData());
    expect(result.error).toContain("No data");
  });

  it("should return an error when amount validation fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockValidateAmounts.mockReturnValue({ valid: false, errors: ["bad amount"] });
    const { importFinancialData } = await import("./actions");
    const result = await importFinancialData(makeFormData());
    expect(result.error).toContain("Invalid");
  });

  it("should create a period and line items when all validation passes", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { importFinancialData } = await import("./actions");
    const result = await importFinancialData(makeFormData());
    expect(result.success).toBe(true);
    expect(result.count).toBe(1);
    expect(mockInsertValues).toHaveBeenCalled();
  });

  it("should return warnings on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockParseQbo.mockReturnValue({
      items: [{ category: "Income", subcategory: "Sales", amount: 1000, lineOrder: 0 }],
      metadata: {},
      warnings: ["Some rows had issues"],
    });
    const { importFinancialData } = await import("./actions");
    const result = await importFinancialData(makeFormData());
    expect(result.success).toBe(true);
    expect(result.warnings).toContain("Some rows had issues");
  });
});
