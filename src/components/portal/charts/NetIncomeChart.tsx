"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NetIncomeChartProps {
  data: { label: string; netIncome: number }[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default function NetIncomeChart({ data }: NetIncomeChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--color-gray-400)] text-sm">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6B7280" }} />
        <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} tickFormatter={formatCurrency} />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Line
          type="monotone"
          dataKey="netIncome"
          name="Net Income"
          stroke="#d69c50"
          strokeWidth={2}
          dot={{ fill: "#d69c50", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
