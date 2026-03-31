"use client";

import RevenueExpenseChart from "@/components/portal/charts/RevenueExpenseChart";
import NetIncomeChart from "@/components/portal/charts/NetIncomeChart";

interface ChartData {
  label: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}

export default function CompanyOverviewCharts({
  data,
}: {
  data: ChartData[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="text-sm font-medium text-[var(--color-gray-500)] mb-3">
          Revenue vs Expenses
        </h3>
        <RevenueExpenseChart data={data} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-[var(--color-gray-500)] mb-3">
          Net Income
        </h3>
        <NetIncomeChart data={data} />
      </div>
    </div>
  );
}
