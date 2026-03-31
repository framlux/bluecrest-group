"use client";

import RevenueExpenseChart from "@/components/portal/charts/RevenueExpenseChart";

export default function PnlChartWrapper({
  data,
}: {
  data: { label: string; revenue: number; expenses: number }[];
}) {
  return <RevenueExpenseChart data={data} />;
}
