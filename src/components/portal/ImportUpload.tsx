"use client";

import { useState } from "react";
import { parseQboPnl, type ParsedPnlData } from "@/lib/import/qbo-parser";
import { inferPeriodType } from "@/lib/import/period-utils";
import { importFinancialData } from "@/app/(portal)/portal/admin/import/actions";
import ImportPreview from "./ImportPreview";

interface ImportUploadProps {
  companies: { id: string; name: string }[];
  defaultCompanyId?: string;
}

export default function ImportUpload({
  companies,
  defaultCompanyId,
}: ImportUploadProps) {
  const [companyId, setCompanyId] = useState(defaultCompanyId || "");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedPnlData | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inferredType =
    periodStart && periodEnd
      ? inferPeriodType(new Date(periodStart), new Date(periodEnd))
      : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setSuccess("");

    try {
      const buffer = await selectedFile.arrayBuffer();
      const parsed = parseQboPnl(buffer);
      setPreview(parsed);
    } catch {
      setError("Failed to parse file. Make sure it's a valid Excel or CSV export from QuickBooks.");
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !companyId || !periodStart || !periodEnd) return;

    setPending(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.set("companyId", companyId);
    formData.set("periodStart", periodStart);
    formData.set("periodEnd", periodEnd);
    formData.set("file", file);

    const result = await importFinancialData(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(
        `Successfully imported ${result.count} line items.${
          result.warnings && result.warnings.length > 0
            ? " Warnings: " + result.warnings.join("; ")
            : ""
        }`
      );
      setFile(null);
      setPreview(null);
      setPeriodStart("");
      setPeriodEnd("");
    }

    setPending(false);
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-[var(--color-gray-200)] rounded-xl text-[var(--color-gray-900)] placeholder-[var(--color-gray-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent transition-all";
  const labelClass =
    "block text-sm font-semibold text-[var(--color-gray-700)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="companyId" className={labelClass}>
            Company <span className="text-red-500">*</span>
          </label>
          <select
            id="companyId"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Select a company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="w-full text-sm text-[var(--color-gray-500)] file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-brand-blue)]/10 file:text-[var(--color-brand-blue)] hover:file:bg-[var(--color-brand-blue)]/20"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="periodStart" className={labelClass}>
            Period Start <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="periodStart"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="periodEnd" className={labelClass}>
            Period End <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="periodEnd"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            required
            className={inputClass}
          />
          {inferredType && (
            <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]">
              {inferredType.charAt(0).toUpperCase() + inferredType.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-gray-700)] mb-2">
            Preview
          </h3>
          <ImportPreview items={preview.items} warnings={preview.warnings} />
        </div>
      )}

      <button
        type="submit"
        disabled={pending || !file || !companyId || !periodStart || !periodEnd}
        className="w-full py-3.5 text-base font-semibold rounded-full bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-blue-dark)] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Importing..." : "Import Data"}
      </button>
    </form>
  );
}
