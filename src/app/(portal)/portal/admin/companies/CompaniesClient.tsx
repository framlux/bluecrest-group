"use client";

import { useState } from "react";
import Link from "next/link";
import CompanyForm from "@/components/portal/CompanyForm";
import { deleteCompany } from "./actions";

interface Company {
  id: string;
  name: string;
  industry: string | null;
  description: string | null;
  fiscalYearStartMonth: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function CompaniesClient({
  companies,
}: {
  companies: Company[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | undefined>();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will remove all associated data.`)) return;
    await deleteCompany(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-gray-900)]">
          Companies
        </h1>
        <button
          onClick={() => {
            setEditCompany(undefined);
            setShowForm(true);
          }}
          className="btn-primary text-sm px-6 py-2.5"
        >
          Add Company
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-12 text-center">
          <p className="text-[var(--color-gray-500)]">
            No companies yet. Create your first company to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-gray-100)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--color-gray-500)]">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--color-gray-500)] hidden md:table-cell">
                  Industry
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--color-gray-500)] hidden lg:table-cell">
                  Fiscal Year Start
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--color-gray-500)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-[var(--color-gray-50)] hover:bg-[var(--color-gray-50)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/portal/admin/companies/${company.id}`}
                      className="font-medium text-[var(--color-gray-900)] hover:text-[var(--color-brand-blue)]"
                    >
                      {company.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-gray-500)] hidden md:table-cell">
                    {company.industry || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-gray-500)] hidden lg:table-cell">
                    {[
                      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                    ][company.fiscalYearStartMonth - 1]}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditCompany(company);
                        setShowForm(true);
                      }}
                      className="text-sm text-[var(--color-brand-blue)] hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company.id, company.name)}
                      className="text-sm text-[var(--color-brand-coral)] hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CompanyForm
          company={editCompany}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
