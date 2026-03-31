"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { PeriodType } from "@/lib/import/period-utils";

interface PeriodSelectorProps {
  availableViews: PeriodType[];
  currentView: PeriodType;
  periods: { id: string; label: string }[];
  currentPeriodId?: string;
}

export default function PeriodSelector({
  availableViews,
  currentView,
  periods,
  currentPeriodId,
}: PeriodSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key === "view") params.delete("period");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* View toggle */}
      <div className="flex rounded-xl border border-[var(--color-gray-200)] overflow-hidden">
        {availableViews.map((view) => (
          <button
            key={view}
            onClick={() => updateParams("view", view)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              currentView === view
                ? "bg-[var(--color-brand-blue)] text-white"
                : "bg-white text-[var(--color-gray-600)] hover:bg-[var(--color-gray-50)]"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Period dropdown */}
      {periods.length > 0 && (
        <select
          value={currentPeriodId || ""}
          onChange={(e) => updateParams("period", e.target.value)}
          className="px-4 py-2 border border-[var(--color-gray-200)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
        >
          {periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
