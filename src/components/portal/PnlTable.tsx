const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

interface PnlLineItem {
  category: string;
  subcategory: string | null;
  amount: number;
  lineOrder: number;
}

interface PnlTableProps {
  items: PnlLineItem[];
  comparisonItems?: PnlLineItem[];
}

export default function PnlTable({ items, comparisonItems }: PnlTableProps) {
  const hasComparison = comparisonItems && comparisonItems.length > 0;

  // Build a lookup for comparison amounts
  const comparisonMap = new Map<string, number>();
  if (comparisonItems) {
    for (const item of comparisonItems) {
      const key = `${item.category}||${item.subcategory ?? ""}`;
      comparisonMap.set(key, item.amount);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-gray-200)] bg-[var(--color-gray-50)]">
            <th className="text-left px-6 py-3 font-semibold text-[var(--color-gray-600)]">
              Account
            </th>
            <th className="text-right px-6 py-3 font-semibold text-[var(--color-gray-600)]">
              Amount
            </th>
            {hasComparison && (
              <>
                <th className="text-right px-6 py-3 font-semibold text-[var(--color-gray-600)] hidden md:table-cell">
                  Prior
                </th>
                <th className="text-right px-6 py-3 font-semibold text-[var(--color-gray-600)] hidden md:table-cell">
                  Change
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const isCategory = !item.subcategory;
            const isTotal =
              item.category.toLowerCase().startsWith("total ") ||
              item.category === "Net Income" ||
              item.category === "Gross Profit" ||
              item.category === "Net Ordinary Income";

            const key = `${item.category}||${item.subcategory ?? ""}`;
            const priorAmount = comparisonMap.get(key);
            const variance =
              priorAmount !== undefined ? item.amount - priorAmount : undefined;
            const variancePct =
              priorAmount !== undefined && priorAmount !== 0
                ? ((item.amount - priorAmount) / Math.abs(priorAmount)) * 100
                : undefined;

            return (
              <tr
                key={i}
                className={`border-b border-[var(--color-gray-100)] ${
                  i % 2 === 0 ? "" : "bg-[var(--color-gray-50)]/30"
                } ${isTotal || isCategory ? "font-semibold" : ""} ${
                  isTotal ? "bg-[var(--color-gray-50)]" : ""
                }`}
              >
                <td
                  className={`px-6 py-2.5 text-[var(--color-gray-900)] ${
                    item.subcategory ? "pl-12" : ""
                  }`}
                >
                  {item.subcategory || item.category}
                </td>
                <td
                  className={`px-6 py-2.5 text-right ${
                    item.amount < 0
                      ? "text-[var(--color-brand-coral)]"
                      : "text-[var(--color-gray-900)]"
                  }`}
                >
                  {formatCurrency(item.amount)}
                </td>
                {hasComparison && (
                  <>
                    <td className="px-6 py-2.5 text-right text-[var(--color-gray-500)] hidden md:table-cell">
                      {priorAmount !== undefined
                        ? formatCurrency(priorAmount)
                        : "—"}
                    </td>
                    <td
                      className={`px-6 py-2.5 text-right hidden md:table-cell ${
                        variance !== undefined && variance < 0
                          ? "text-[var(--color-brand-coral)]"
                          : variance !== undefined && variance > 0
                          ? "text-[var(--color-brand-blue)]"
                          : "text-[var(--color-gray-500)]"
                      }`}
                    >
                      {variance !== undefined
                        ? `${formatCurrency(variance)} (${
                            variancePct !== undefined
                              ? variancePct.toFixed(1) + "%"
                              : "—"
                          })`
                        : "—"}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
