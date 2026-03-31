import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, companyAccess } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  let userCompanies;

  if (session.user.role === "admin") {
    userCompanies = await db.select().from(companies).orderBy(companies.name);
  } else {
    userCompanies = await db
      .select({
        id: companies.id,
        name: companies.name,
        industry: companies.industry,
        description: companies.description,
        fiscalYearStartMonth: companies.fiscalYearStartMonth,
        createdAt: companies.createdAt,
        updatedAt: companies.updatedAt,
      })
      .from(companyAccess)
      .innerJoin(companies, eq(companyAccess.companyId, companies.id))
      .where(eq(companyAccess.userId, session.user.id))
      .orderBy(companies.name);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-gray-900)]">
          Welcome, {session.user.name || session.user.email.split("@")[0]}
        </h1>
        <p className="text-[var(--color-gray-500)] mt-1">
          {session.user.role === "admin"
            ? "Manage companies and financial data"
            : "View your company financial dashboards"}
        </p>
      </div>

      {userCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-12 text-center">
          <svg
            className="w-16 h-16 text-[var(--color-gray-300)] mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="text-lg font-semibold text-[var(--color-gray-700)] mb-2">
            {session.user.role === "admin"
              ? "No companies yet"
              : "No companies assigned"}
          </h3>
          <p className="text-[var(--color-gray-500)] mb-6">
            {session.user.role === "admin"
              ? "Create your first company to get started."
              : "Contact your administrator to get access to a company."}
          </p>
          {session.user.role === "admin" && (
            <Link
              href="/portal/admin/companies"
              className="btn-primary inline-block"
            >
              Add Company
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/portal/companies/${company.id}`}
              className="bg-white rounded-2xl shadow-[var(--shadow-soft)] p-6 hover:shadow-[var(--shadow-xl)] transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-blue)]/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[var(--color-brand-blue)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-gray-900)]">
                {company.name}
              </h3>
              {company.industry && (
                <p className="text-sm text-[var(--color-gray-500)] mt-1">
                  {company.industry}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
