"use client";

import { useState } from "react";
import { createCompany, updateCompany } from "@/app/(portal)/portal/admin/companies/actions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CompanyFormProps {
  company?: {
    id: string;
    name: string;
    industry: string | null;
    description: string | null;
    fiscalYearStartMonth: number;
  };
  onClose: () => void;
}

export default function CompanyForm({ company, onClose }: CompanyFormProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = company
      ? await updateCompany(company.id, formData)
      : await createCompany(formData);

    if (result.error) {
      setError(result.error);
      setPending(false);
    } else {
      onClose();
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-[var(--color-gray-200)] rounded-xl text-[var(--color-gray-900)] placeholder-[var(--color-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all";
  const labelClass =
    "block text-sm font-semibold text-[var(--color-gray-700)] mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold text-[var(--color-gray-900)] mb-6">
          {company ? "Edit Company" : "Add Company"}
        </h2>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={company?.name ?? ""}
              className={inputClass}
              placeholder="Acme Corporation"
            />
          </div>

          <div>
            <label htmlFor="industry" className={labelClass}>
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              defaultValue={company?.industry ?? ""}
              className={inputClass}
              placeholder="Real Estate, Technology, etc."
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={company?.description ?? ""}
              className={inputClass}
              placeholder="Brief description of the company..."
            />
          </div>

          <div>
            <label htmlFor="fiscalYearStartMonth" className={labelClass}>
              Fiscal Year Start Month
            </label>
            <select
              id="fiscalYearStartMonth"
              name="fiscalYearStartMonth"
              defaultValue={company?.fiscalYearStartMonth ?? 1}
              className={inputClass}
            >
              {MONTHS.map((month, idx) => (
                <option key={month} value={idx + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold rounded-full border border-[var(--color-gray-300)] text-[var(--color-gray-700)] hover:border-[var(--color-gray-400)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 py-3 text-sm font-semibold rounded-full bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-blue-dark)] transition-all disabled:opacity-50"
            >
              {pending ? "Saving..." : company ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
