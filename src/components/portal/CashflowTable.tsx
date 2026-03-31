const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

interface CashflowItem {
  category: string;
  amount: number;
  lineOrder: number;
}

interface CashflowTableProps {
  items: CashflowItem[];
}

export default function CashflowTable({ items }: CashflowTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-gray-200)] bg-[var(--color-gray-50)]">
            <th className="text-left px-6 py-3 font-semibold text-[var(--color-gray-600)]">
              Category
            </th>
            <th className="text-right px-6 py-3 font-semibold text-[var(--color-gray-600)]">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              className={`border-b border-[var(--color-gray-100)] ${
                i % 2 === 0 ? "" : "bg-[var(--color-gray-50)]/30"
              }`}
            >
              <td className="px-6 py-2.5 text-[var(--color-gray-900)]">
                {item.category}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
