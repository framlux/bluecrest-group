import { verifyCompanyAccess } from "@/lib/portal/access";
import {
  getCompanyPeriods,
  getPnlForPeriod,
  getPnlComparison,
  getPnlTrend,
} from "@/lib/db/queries";
import { inferPeriodType, type PeriodType } from "@/lib/import/period-utils";
import PnlTable from "@/components/portal/PnlTable";
import PeriodSelector from "@/components/portal/PeriodSelector";
import Link from "next/link";
import PnlChartWrapper from "./PnlChartWrapper";

export const metadata = { title: "Profit & Loss" };

export default async function PnlDetailPage({
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

  // Filter periods by view type
  const filteredPeriods = allPeriods.filter(
    (p) => inferPeriodType(p.periodStart, p.periodEnd) === currentView
  );

  // Determine available view types
  const viewTypes = [
    ...new Set(
      allPeriods.map((p) => inferPeriodType(p.periodStart, p.periodEnd))
    ),
  ] as PeriodType[];

  // Select current period
  const selectedPeriod =
    filteredPeriods.find((p) => p.id === periodParam) || filteredPeriods[0];

  // Get P&L data
  let items: { category: string; subcategory: string | null; amount: number; lineOrder: number }[] = [];
  let comparisonItems: { category: string; subcategory: string | null; amount: number; lineOrder: number }[] = [];

  if (selectedPeriod) {
    const rawItems = await getPnlForPeriod(selectedPeriod.id);
    items = rawItems.map((i) => ({
      category: i.category,
      subcategory: i.subcategory,
      amount: Number(i.amount),
      lineOrder: i.lineOrder,
    }));

    // Get comparison data
    const comparison = await getPnlComparison(id, selectedPeriod.id);
    if (comparison) {
      const rawComparison = await getPnlForPeriod(comparison.priorPeriod.id);
      comparisonItems = rawComparison.map((i) => ({
        category: i.category,
        subcategory: i.subcategory,
        amount: Number(i.amount),
        lineOrder: i.lineOrder,
      }));
    }
  }

  // Chart trend data
  const trendPeriods = await getPnlTrend(id, currentView, 6);
  const chartData = await Promise.all(
    trendPeriods.map(async (p) => {
      const pItems = await getPnlForPeriod(p.id);
      const revenue = pItems
        .filter(
          (i) =>
            (i.category === "Income" && !i.subcategory) ||
            i.category === "Total Income" ||
            i.category === "Gross Profit"
        )
        .reduce((sum, i) => sum + Number(i.amount), 0);
      const expenses = Math.abs(
        pItems
          .filter(
            (i) =>
              (i.category === "Expenses" && !i.subcategory) ||
              i.category === "Total Expenses"
          )
          .reduce((sum, i) => sum + Number(i.amount), 0)
      );
      return {
        label: p.periodStart.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        revenue,
        expenses,
      };
    })
  );

  // Period selector options
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
          Profit & Loss
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

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6 mb-6">
          <PnlChartWrapper data={chartData} />
        </div>
      )}

      {/* Table */}
      {items.length > 0 ? (
        <PnlTable items={items} comparisonItems={comparisonItems} />
      ) : (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-8 text-center">
          <p className="text-[var(--color-gray-500)]">
            No P&L data available for this period.
          </p>
        </div>
      )}
    </div>
  );
}
