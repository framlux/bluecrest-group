import { getAllCompanies, getAllUsers, getRecentImportsCount } from "@/lib/db/queries";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [allCompanies, allUsers, recentImports] = await Promise.all([
    getAllCompanies(),
    getAllUsers(),
    getRecentImportsCount(),
  ]);

  const cards = [
    {
      label: "Companies",
      value: allCompanies.length,
      href: "/portal/admin/companies",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      ),
    },
    {
      label: "Users",
      value: allUsers.length,
      href: "/portal/admin/users",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      ),
    },
    {
      label: "Recent Imports",
      value: recentImports,
      href: "/portal/admin/import",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-gray-900)] mb-8">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6 hover:shadow-[var(--shadow-xl)] transition-all hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-blue)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-brand-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon}
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-gray-900)]">
                  {card.value}
                </p>
                <p className="text-sm text-[var(--color-gray-500)]">
                  {card.label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
