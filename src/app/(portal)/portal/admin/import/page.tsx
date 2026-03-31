import { getAllCompanies } from "@/lib/db/queries";
import ImportUpload from "@/components/portal/ImportUpload";

export const metadata = { title: "Import Data" };

export default async function ImportPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { companyId } = await searchParams;
  const allCompanies = await getAllCompanies();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-gray-900)] mb-2">
        Import Financial Data
      </h1>
      <p className="text-[var(--color-gray-500)] mb-8">
        Upload a QuickBooks Online P&L export (Excel or CSV) for a company.
      </p>

      <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6">
        <ImportUpload
          companies={allCompanies.map((c) => ({ id: c.id, name: c.name }))}
          defaultCompanyId={companyId}
        />
      </div>
    </div>
  );
}
