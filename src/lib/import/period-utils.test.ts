import { describe, it, expect } from "vitest";
import {
  inferPeriodType,
  getFiscalQuarter,
  getFiscalYear,
  getQuarterDateRange,
  getFiscalYearDateRange,
  getQuarterLabel,
} from "./period-utils";

describe("inferPeriodType", () => {
  it("should classify a 7-day range as weekly", () => {
    expect(inferPeriodType(new Date("2024-01-01"), new Date("2024-01-08"))).toBe("weekly");
  });

  it("should classify a 14-day range as weekly (boundary)", () => {
    expect(inferPeriodType(new Date("2024-01-01"), new Date("2024-01-15"))).toBe("weekly");
  });

  it("should classify a 30-day range as monthly", () => {
    expect(inferPeriodType(new Date("2024-01-01"), new Date("2024-01-31"))).toBe("monthly");
  });

  it("should classify a 45-day range as monthly (boundary)", () => {
    expect(inferPeriodType(new Date("2024-01-01"), new Date("2024-02-15"))).toBe("monthly");
  });

  it("should classify a 90-day range as quarterly", () => {
    expect(inferPeriodType(new Date("2024-01-01"), new Date("2024-03-31"))).toBe("quarterly");
  });

  it("should classify a 120-day range as quarterly (boundary)", () => {
    expect(inferPeriodType(new Date("2024-01-01"), new Date("2024-04-30"))).toBe("quarterly");
  });

  it("should classify a 365-day range as annual", () => {
    expect(inferPeriodType(new Date("2024-01-01"), new Date("2024-12-31"))).toBe("annual");
  });
});

describe("getFiscalQuarter", () => {
  it("should return Q1 for April when fiscal year starts in April", () => {
    expect(getFiscalQuarter(new Date("2024-04-15"), 4)).toBe(1);
  });

  it("should return Q4 for February when fiscal year starts in April", () => {
    expect(getFiscalQuarter(new Date("2025-02-15"), 4)).toBe(4);
  });

  it("should return Q1 for January when fiscal year starts in January", () => {
    expect(getFiscalQuarter(new Date("2024-01-15"), 1)).toBe(1);
  });

  it("should return Q2 for April when fiscal year starts in January", () => {
    expect(getFiscalQuarter(new Date("2024-04-15"), 1)).toBe(2);
  });
});

describe("getFiscalYear", () => {
  it("should return calendar year when fiscal year starts in January", () => {
    expect(getFiscalYear(new Date("2025-06-15"), 1)).toBe(2025);
  });

  it("should return FY2025 for Feb 2025 when fiscal year starts in April", () => {
    // Feb is before April, so still in FY that started Apr 2024 → FY2025
    expect(getFiscalYear(new Date("2025-02-15"), 4)).toBe(2025);
  });

  it("should return FY2026 for April 2025 when fiscal year starts in April", () => {
    // April >= April start, so new FY → 2025 + 1 = FY2026
    expect(getFiscalYear(new Date("2025-04-15"), 4)).toBe(2026);
  });
});

describe("getQuarterDateRange", () => {
  it("should return Apr 1 to Jun 30 for Q1 FY2025 with April start", () => {
    const { start, end } = getQuarterDateRange(2025, 1, 4);
    expect(start.getFullYear()).toBe(2024);
    expect(start.getMonth()).toBe(3); // April (0-indexed)
    expect(start.getDate()).toBe(1);
    expect(end.getMonth()).toBe(5); // June
    expect(end.getDate()).toBe(30);
  });

  it("should return Jan 1 to Mar 31 for Q4 FY2025 with April start", () => {
    const { start, end } = getQuarterDateRange(2025, 4, 4);
    expect(start.getFullYear()).toBe(2025);
    expect(start.getMonth()).toBe(0); // January
    expect(start.getDate()).toBe(1);
    expect(end.getMonth()).toBe(2); // March
    expect(end.getDate()).toBe(31);
  });

  it("should return Jan 1 to Mar 31 for Q1 FY2025 with January start", () => {
    const { start, end } = getQuarterDateRange(2025, 1, 1);
    expect(start.getFullYear()).toBe(2025);
    expect(start.getMonth()).toBe(0); // January
    expect(end.getMonth()).toBe(2); // March
    expect(end.getDate()).toBe(31);
  });
});

describe("getFiscalYearDateRange", () => {
  it("should span Apr 2024 to Mar 2025 for FY2025 with April start", () => {
    const { start, end } = getFiscalYearDateRange(2025, 4);
    expect(start.getFullYear()).toBe(2024);
    expect(start.getMonth()).toBe(3); // April
    expect(end.getFullYear()).toBe(2025);
    expect(end.getMonth()).toBe(2); // March
    expect(end.getDate()).toBe(31);
  });

  it("should span Jan to Dec 2025 for FY2025 with January start", () => {
    const { start, end } = getFiscalYearDateRange(2025, 1);
    expect(start.getFullYear()).toBe(2025);
    expect(start.getMonth()).toBe(0); // January
    expect(end.getFullYear()).toBe(2025);
    expect(end.getMonth()).toBe(11); // December
    expect(end.getDate()).toBe(31);
  });
});

describe("getQuarterLabel", () => {
  it("should return Q1 FY2025", () => {
    expect(getQuarterLabel(2025, 1)).toBe("Q1 FY2025");
  });
});
