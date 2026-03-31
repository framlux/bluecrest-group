const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

interface SummaryCardProps {
  label: string;
  value: number;
  previousValue?: number;
}

export default function SummaryCard({
  label,
  value,
  previousValue,
}: SummaryCardProps) {
  const change =
    previousValue !== undefined && previousValue !== 0
      ? ((value - previousValue) / Math.abs(previousValue)) * 100
      : null;

  const isPositive = change !== null && change >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6">
      <p className="text-sm font-medium text-[var(--color-gray-500)] mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          value < 0
            ? "text-[var(--color-brand-coral)]"
            : "text-[var(--color-gray-900)]"
        }`}
      >
        {formatCurrency(value)}
      </p>
      {change !== null && (
        <p
          className={`text-sm mt-1 flex items-center gap-1 ${
            isPositive
              ? "text-[var(--color-brand-blue)]"
              : "text-[var(--color-brand-coral)]"
          }`}
        >
          <span>{isPositive ? "↑" : "↓"}</span>
          <span>{Math.abs(change).toFixed(1)}%</span>
          <span className="text-[var(--color-gray-400)]">vs prior</span>
        </p>
      )}
    </div>
  );
}
