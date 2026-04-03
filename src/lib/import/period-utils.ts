export type PeriodType = "weekly" | "monthly" | "quarterly" | "annual";

/**
 * Infer the period type from a date range based on the number of days.
 */
export function inferPeriodType(startDate: Date, endDate: Date): PeriodType {
  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 14) return "weekly";
  if (days <= 45) return "monthly";
  if (days <= 120) return "quarterly";
  return "annual";
}

/**
 * Get the fiscal quarter (1-4) for a given date based on the fiscal year start month.
 *
 * Example: fiscalYearStartMonth=4 (April)
 *   April-June = Q1, July-Sept = Q2, Oct-Dec = Q3, Jan-March = Q4
 */
export function getFiscalQuarter(
  date: Date,
  fiscalYearStartMonth: number
): number {
  const month = date.getMonth() + 1; // 1-indexed
  // Calculate months since fiscal year start
  const monthsFromStart = ((month - fiscalYearStartMonth + 12) % 12);
  return Math.floor(monthsFromStart / 3) + 1;
}

/**
 * Get the fiscal year for a given date based on the fiscal year start month.
 *
 * If fiscal year starts in April (4), then:
 *   - April 2024 through March 2025 = FY2025 (fiscal year named by end year)
 *
 * If fiscal year starts in January (1), fiscal year = calendar year.
 */
export function getFiscalYear(
  date: Date,
  fiscalYearStartMonth: number
): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-indexed

  if (fiscalYearStartMonth === 1) return year;

  // If the current month is before the fiscal year start, we're in the
  // fiscal year that started in the previous calendar year
  if (month < fiscalYearStartMonth) {
    return year;
  }
  return year + 1;
}

/**
 * Get the start and end dates for a fiscal quarter.
 */
export function getQuarterDateRange(
  fiscalYear: number,
  quarter: number,
  fiscalYearStartMonth: number
): { start: Date; end: Date } {
  // Calculate the calendar month where this quarter starts
  const quarterStartOffset = (quarter - 1) * 3;
  const startMonth = ((fiscalYearStartMonth - 1 + quarterStartOffset) % 12) + 1;

  // Calculate the calendar year for the start of this quarter
  let startYear: number;
  if (fiscalYearStartMonth === 1) {
    startYear = fiscalYear;
  } else {
    // Fiscal year is named by end year, so it starts in (fiscalYear - 1)
    startYear = fiscalYear - 1;
    // If the quarter's start month is before the fiscal year start month in
    // the calendar, it's in the next calendar year
    if (startMonth < fiscalYearStartMonth) {
      startYear = fiscalYear;
    }
  }

  const start = new Date(startYear, startMonth - 1, 1);

  // End is the last day of the 3rd month of the quarter.
  // startMonth + 2 = the last month of the quarter (1-indexed).
  // Use day 0 of the *next* month to get the last day of that month.
  const endMonthIndex = (startMonth - 1 + 2) % 12; // 0-indexed, the 3rd month
  let endYear = startYear;
  if (endMonthIndex < startMonth - 1) {
    endYear = startYear + 1; // quarter wraps into next calendar year
  }
  const end = new Date(endYear, endMonthIndex + 1, 0); // day 0 = last day of endMonth

  return { start, end };
}

/**
 * Get a display label for a fiscal quarter.
 */
export function getQuarterLabel(
  fiscalYear: number,
  quarter: number
): string {
  return `Q${quarter} FY${fiscalYear}`;
}

/**
 * Get the fiscal year date range.
 */
export function getFiscalYearDateRange(
  fiscalYear: number,
  fiscalYearStartMonth: number
): { start: Date; end: Date } {
  const q1 = getQuarterDateRange(fiscalYear, 1, fiscalYearStartMonth);
  const q4 = getQuarterDateRange(fiscalYear, 4, fiscalYearStartMonth);
  return { start: q1.start, end: q4.end };
}
