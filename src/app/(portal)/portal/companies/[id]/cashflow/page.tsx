import { verifyCompanyAccess } from "@/lib/portal/access";
import {
  getCompanyPeriods,
  getCashflowForPeriod,
  getPnlTrend,
  getPnlForPeriod,
} from "@/lib/db/queries";
import { inferPeriodType, type PeriodType } from "@/lib/import/period-utils";
import CashflowTable from "@/components/portal/CashflowTable";
import PeriodSelector from "@/components/portal/PeriodSelector";
import Link from "next/link";
import CashflowChartWrapper from "./CashflowChartWrapper";

export const metadata = { title: "Cash Flow" };

export default async function CashflowDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string; period?: string }>;
}) {
  const { id } = await params;
  const { view: viewParam, period: periodParam } = await searchParams;
  const company = await verifyCompanyAccess(id);
  const allPeriods = await getCompanyPeriods(id);

  const currentView = (viewParam as PeriodType) || "monthly";

  const filteredPeriods = allPeriods.filter(
    (p) => inferPeriodType(p.periodStart, p.periodEnd) === currentView
  );

  const viewTypes = [
    ...new Set(
      allPeriods.map((p) => inferPeriodType(p.periodStart, p.periodEnd))
    ),
  ] as PeriodType[];

  const selectedPeriod =
    filteredPeriods.find((p) => p.id === periodParam) || filteredPeriods[0];

  // Get cashflow data for selected period
  let items: { category: string; amount: number; lineOrder: number }[] = [];
  if (selectedPeriod) {
    const rawItems = await getCashflowForPeriod(selectedPeriod.id);
    items = rawItems.map((i) => ({
      category: i.category,
      amount: Number(i.amount),
      lineOrder: i.lineOrder,
    }));

    // If no cashflow items, derive from P&L net income
    if (items.length === 0) {
      const pnlItems = await getPnlForPeriod(selectedPeriod.id);
      const netIncome = pnlItems
        .filter((i) => i.category === "Net Income")
        .reduce((sum, i) => sum + Number(i.amount), 0);
      if (netIncome !== 0) {
        items = [
          { category: "Net Income (from P&L)", amount: netIncome, lineOrder: 0 },
        ];
      }
    }
  }

  // Chart trend data
  const trendPeriods = await getPnlTrend(id, currentView, 6);
  const chartData = await Promise.all(
    trendPeriods.map(async (p) => {
      const pItems = await getPnlForPeriod(p.id);
      const netIncome = pItems
        .filter((i) => i.category === "Net Income")
        .reduce((sum, i) => sum + Number(i.amount), 0);
      return {
        label: p.periodStart.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        cashflow: netIncome,
      };
    })
  );

  const periodOptions = filteredPeriods.map((p) => ({
    id: p.id,
    label: `${p.periodStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${p.periodEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
  }));

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/portal/companies/${id}`}
          className="text-sm text-[var(--color-brand-blue)] hover:underline mb-2 inline-block"
        >
          &larr; Back to {company.name}
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-gray-900)]">
          Cash Flow
        </h1>
      </div>

      <div className="mb-6">
        <PeriodSelector
          availableViews={viewTypes.length > 0 ? viewTypes : ["monthly"]}
          currentView={currentView}
          periods={periodOptions}
          currentPeriodId={selectedPeriod?.id}
        />
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6 mb-6">
          <CashflowChartWrapper data={chartData} />
        </div>
      )}

      {items.length > 0 ? (
        <CashflowTable items={items} />
      ) : (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-8 text-center">
          <p className="text-[var(--color-gray-500)]">
            No cash flow data available for this period.
          </p>
        </div>
      )}
    </div>
  );
}
