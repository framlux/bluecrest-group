import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { companies, companyAccess } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

/**
 * Verify the current user has access to the given company.
 * Admins can access all companies. Clients need a companyAccess record.
 * Returns the company if access is granted, or calls notFound()/redirect().
 */
export async function verifyCompanyAccess(companyId: string) {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  // Fetch the company
  const result = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (result.length === 0) notFound();

  const company = result[0];

  // Admins can access all companies
  if (session.user.role === "admin") return company;

  // Check companyAccess for client users
  const access = await db
    .select({ id: companyAccess.id })
    .from(companyAccess)
    .where(
      and(
        eq(companyAccess.userId, session.user.id),
        eq(companyAccess.companyId, companyId)
      )
    )
    .limit(1);

  if (access.length === 0) notFound();

  return company;
}
