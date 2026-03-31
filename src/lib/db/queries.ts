import { db } from "@/lib/db";
import {
  users,
  companies,
  companyAccess,
  financialPeriods,
  pnlLineItems,
  cashflowItems,
} from "@/lib/db/schema";
import { eq, desc, and, sql, between, asc } from "drizzle-orm";
import { inferPeriodType, type PeriodType } from "@/lib/import/period-utils";

// ═══════════════════════════════════════════════════════════════════════════════
// USER QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAllUsers() {
  return db.select().from(users).orderBy(users.name);
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] ?? null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPANY QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAllCompanies() {
  return db.select().from(companies).orderBy(companies.name);
}

export async function getCompanyById(id: string) {
  const result = await db
    .select()
    .from(companies)
    .where(eq(companies.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function getUserCompanies(userId: string, role: string) {
  if (role === "admin") {
    return getAllCompanies();
  }
  return db
    .select({
      id: companies.id,
      name: companies.name,
      industry: companies.industry,
      description: companies.description,
      fiscalYearStartMonth: companies.fiscalYearStartMonth,
      createdAt: companies.createdAt,
      updatedAt: companies.updatedAt,
    })
    .from(companyAccess)
    .innerJoin(companies, eq(companyAccess.companyId, companies.id))
    .where(eq(companyAccess.userId, userId))
    .orderBy(companies.name);
}

export async function getCompanyUsers(companyId: string) {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(companyAccess)
    .innerJoin(users, eq(companyAccess.userId, users.id))
    .where(eq(companyAccess.companyId, companyId))
    .orderBy(users.name);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

export async function getCompanyPeriods(companyId: string) {
  return db
    .select()
    .from(financialPeriods)
    .where(eq(financialPeriods.companyId, companyId))
    .orderBy(desc(financialPeriods.periodStart));
}

export async function getCompanySummary(companyId: string) {
  // Get the latest period
  const latestPeriods = await db
    .select()
    .from(financialPeriods)
    .where(eq(financialPeriods.companyId, companyId))
    .orderBy(desc(financialPeriods.periodEnd))
    .limit(1);

  if (latestPeriods.length === 0) return null;

  const period = latestPeriods[0];
  const items = await db
    .select()
    .from(pnlLineItems)
    .where(eq(pnlLineItems.periodId, period.id));

  const revenue = items
    .filter((i) => i.category === "Income" && !i.subcategory)
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const totalRevenue =
    revenue ||
    items
      .filter(
        (i) =>
          i.category === "Income" ||
          i.category === "Total Income" ||
          i.category === "Gross Profit"
      )
      .reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = items
    .filter(
      (i) =>
        i.category === "Expenses" ||
        i.category === "Total Expenses"
    )
    .filter((i) => !i.subcategory)
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const netIncome = items
    .filter((i) => i.category === "Net Income")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  return {
    period,
    revenue: totalRevenue,
    expenses: Math.abs(totalExpenses),
    netIncome,
  };
}

export async function getPnlForPeriod(periodId: string) {
  return db
    .select()
    .from(pnlLineItems)
    .where(eq(pnlLineItems.periodId, periodId))
    .orderBy(asc(pnlLineItems.lineOrder));
}

export async function getCashflowForPeriod(periodId: string) {
  return db
    .select()
    .from(cashflowItems)
    .where(eq(cashflowItems.periodId, periodId))
    .orderBy(asc(cashflowItems.lineOrder));
}

export async function getAggregatedPnl(
  companyId: string,
  startDate: Date,
  endDate: Date
) {
  // Get all periods within the date range
  const periods = await db
    .select()
    .from(financialPeriods)
    .where(
      and(
        eq(financialPeriods.companyId, companyId),
        sql`${financialPeriods.periodStart} >= ${startDate}`,
        sql`${financialPeriods.periodEnd} <= ${endDate}`
      )
    );

  if (periods.length === 0) return [];

  const periodIds = periods.map((p) => p.id);

  // Get all line items for these periods and aggregate by category/subcategory
  const allItems = await db
    .select()
    .from(pnlLineItems)
    .where(sql`${pnlLineItems.periodId} IN ${periodIds}`);

  // Aggregate by category + subcategory
  const aggregated = new Map<
    string,
    { category: string; subcategory: string | null; amount: number; lineOrder: number }
  >();

  for (const item of allItems) {
    const key = `${item.category}||${item.subcategory ?? ""}`;
    const existing = aggregated.get(key);
    if (existing) {
      existing.amount += Number(item.amount);
    } else {
      aggregated.set(key, {
        category: item.category,
        subcategory: item.subcategory,
        amount: Number(item.amount),
        lineOrder: item.lineOrder,
      });
    }
  }

  return Array.from(aggregated.values()).sort(
    (a, b) => a.lineOrder - b.lineOrder
  );
}

export async function getPnlComparison(companyId: string, periodId: string) {
  // Get the current period
  const currentPeriods = await db
    .select()
    .from(financialPeriods)
    .where(eq(financialPeriods.id, periodId))
    .limit(1);

  if (currentPeriods.length === 0) return null;

  const current = currentPeriods[0];
  const currentType = inferPeriodType(current.periodStart, current.periodEnd);

  // Find the prior period of the same type
  const priorPeriods = await db
    .select()
    .from(financialPeriods)
    .where(
      and(
        eq(financialPeriods.companyId, companyId),
        sql`${financialPeriods.periodEnd} < ${current.periodStart}`
      )
    )
    .orderBy(desc(financialPeriods.periodEnd));

  // Find the first prior period that matches the same type
  const priorPeriod = priorPeriods.find(
    (p) => inferPeriodType(p.periodStart, p.periodEnd) === currentType
  );

  if (!priorPeriod) return null;

  return {
    currentPeriod: current,
    priorPeriod,
  };
}

export async function getPnlTrend(
  companyId: string,
  periodType: PeriodType,
  count: number = 6
) {
  const allPeriods = await db
    .select()
    .from(financialPeriods)
    .where(eq(financialPeriods.companyId, companyId))
    .orderBy(desc(financialPeriods.periodStart));

  // Filter by inferred period type
  const matchingPeriods = allPeriods
    .filter(
      (p) => inferPeriodType(p.periodStart, p.periodEnd) === periodType
    )
    .slice(0, count)
    .reverse(); // chronological order

  return matchingPeriods;
}

export async function getRecentImportsCount() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(financialPeriods)
    .where(sql`${financialPeriods.createdAt} >= ${thirtyDaysAgo}`);

  return Number(result[0]?.count ?? 0);
}
