"use client";

import type { ParsedPnlItem } from "@/lib/import/qbo-parser";

interface ImportPreviewProps {
  items: ParsedPnlItem[];
  warnings: string[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export default function ImportPreview({ items, warnings }: ImportPreviewProps) {
  if (items.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
        No data could be parsed from this file.
      </div>
    );
  }

  return (
    <div>
      {warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm mb-4">
          <p className="font-medium mb-1">Warnings:</p>
          <ul className="list-disc pl-4">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border border-[var(--color-gray-200)] rounded-xl overflow-hidden max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-gray-50)] sticky top-0">
              <th className="text-left px-4 py-2 font-medium text-[var(--color-gray-500)]">
                Category
              </th>
              <th className="text-left px-4 py-2 font-medium text-[var(--color-gray-500)]">
                Subcategory
              </th>
              <th className="text-right px-4 py-2 font-medium text-[var(--color-gray-500)]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={i}
                className={`border-t border-[var(--color-gray-100)] ${
                  !item.subcategory ? "font-medium bg-[var(--color-gray-50)]/50" : ""
                }`}
              >
                <td className="px-4 py-2 text-[var(--color-gray-900)]">
                  {item.category}
                </td>
                <td className="px-4 py-2 text-[var(--color-gray-600)]">
                  {item.subcategory || "—"}
                </td>
                <td
                  className={`px-4 py-2 text-right ${
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

      <p className="text-xs text-[var(--color-gray-400)] mt-2">
        {items.length} line items parsed
      </p>
    </div>
  );
}
