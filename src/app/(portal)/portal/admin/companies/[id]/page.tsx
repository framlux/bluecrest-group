import { getCompanyById, getCompanyUsers, getAllUsers } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import CompanyAccessClient from "./CompanyAccessClient";

export const metadata = { title: "Company Details" };

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) notFound();

  const [companyUsers, allUsers] = await Promise.all([
    getCompanyUsers(id),
    getAllUsers(),
  ]);

  // Users NOT already assigned to this company
  const availableUsers = allUsers.filter(
    (u) => !companyUsers.some((cu) => cu.id === u.id)
  );

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/portal/admin/companies"
          className="text-sm text-[var(--color-brand-blue)] hover:underline mb-2 inline-block"
        >
          &larr; Back to Companies
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-gray-900)]">
          {company.name}
        </h1>
        <div className="flex gap-4 mt-2 text-sm text-[var(--color-gray-500)]">
          {company.industry && <span>{company.industry}</span>}
          <span>FY starts {MONTHS[company.fiscalYearStartMonth - 1]}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-gray-900)] mb-4">
            Company Info
          </h2>
          <p className="text-sm text-[var(--color-gray-600)]">
            {company.description || "No description provided."}
          </p>
          <div className="mt-4">
            <Link
              href={`/portal/admin/import?companyId=${company.id}`}
              className="btn-secondary text-sm px-5 py-2"
            >
              Import Data
            </Link>
          </div>
        </div>

        {/* User Access */}
        <CompanyAccessClient
          companyId={id}
          companyUsers={companyUsers}
          availableUsers={availableUsers.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
          }))}
        />
      </div>
    </div>
  );
}
