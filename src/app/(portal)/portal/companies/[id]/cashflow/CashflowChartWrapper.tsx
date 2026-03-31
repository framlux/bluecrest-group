"use client";

import CashflowChart from "@/components/portal/charts/CashflowChart";

export default function CashflowChartWrapper({
  data,
}: {
  data: { label: string; cashflow: number }[];
}) {
  return <CashflowChart data={data} />;
}
