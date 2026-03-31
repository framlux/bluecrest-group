import { verifyCompanyAccess } from "@/lib/portal/access";
import { getCompanySummary, getPnlTrend, getPnlForPeriod } from "@/lib/db/queries";
import SummaryCard from "@/components/portal/SummaryCard";
import Link from "next/link";
import CompanyOverviewCharts from "./CompanyOverviewCharts";

export const metadata = { title: "Company Overview" };

export default async function CompanyOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await verifyCompanyAccess(id);
  const summary = await getCompanySummary(id);
  const trendPeriods = await getPnlTrend(id, "monthly", 6);

  // Build trend chart data
  const chartData = await Promise.all(
    trendPeriods.map(async (period) => {
      const items = await getPnlForPeriod(period.id);
      const revenue = items
        .filter(
          (i) =>
            (i.category === "Income" && !i.subcategory) ||
            i.category === "Total Income" ||
            i.category === "Gross Profit"
        )
        .reduce((sum, i) => sum + Number(i.amount), 0);
      const expenses = Math.abs(
        items
          .filter(
            (i) =>
              (i.category === "Expenses" && !i.subcategory) ||
              i.category === "Total Expenses"
          )
          .reduce((sum, i) => sum + Number(i.amount), 0)
      );
      const netIncome = items
        .filter((i) => i.category === "Net Income")
        .reduce((sum, i) => sum + Number(i.amount), 0);

      const label = period.periodStart.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });

      return { label, revenue, expenses, netIncome };
    })
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-gray-900)]">
          {company.name}
        </h1>
        {company.industry && (
          <p className="text-[var(--color-gray-500)] mt-1">
            {company.industry}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      {summary ? (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <SummaryCard label="Revenue" value={summary.revenue} />
          <SummaryCard label="Expenses" value={summary.expenses} />
          <SummaryCard label="Net Income" value={summary.netIncome} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-8 text-center mb-8">
          <p className="text-[var(--color-gray-500)]">
            No financial data has been imported yet.
          </p>
        </div>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6 mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-gray-900)] mb-4">
            Trend
          </h2>
          <CompanyOverviewCharts data={chartData} />
        </div>
      )}

      {/* Links */}
      <div className="flex gap-4">
        <Link
          href={`/portal/companies/${id}/pnl`}
          className="btn-secondary text-sm px-6 py-2.5"
        >
          Detailed P&L
        </Link>
        <Link
          href={`/portal/companies/${id}/cashflow`}
          className="btn-navy text-sm px-6 py-2.5"
        >
          Cash Flow
        </Link>
      </div>
    </div>
  );
}
