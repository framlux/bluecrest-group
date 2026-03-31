"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createCompany(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const description = formData.get("description") as string;
  const fiscalYearStartMonth = parseInt(
    formData.get("fiscalYearStartMonth") as string,
    10
  );

  if (!name) return { error: "Company name is required" };

  await db.insert(companies).values({
    name,
    industry: industry || null,
    description: description || null,
    fiscalYearStartMonth: fiscalYearStartMonth || 1,
  });

  revalidatePath("/portal/admin/companies");
  revalidatePath("/portal/dashboard");
  return { success: true };
}

export async function updateCompany(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const industry = formData.get("industry") as string;
  const description = formData.get("description") as string;
  const fiscalYearStartMonth = parseInt(
    formData.get("fiscalYearStartMonth") as string,
    10
  );

  if (!name) return { error: "Company name is required" };

  await db
    .update(companies)
    .set({
      name,
      industry: industry || null,
      description: description || null,
      fiscalYearStartMonth: fiscalYearStartMonth || 1,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, id));

  revalidatePath("/portal/admin/companies");
  revalidatePath("/portal/dashboard");
  return { success: true };
}

export async function deleteCompany(id: string) {
  await requireAdmin();

  await db.delete(companies).where(eq(companies.id, id));

  revalidatePath("/portal/admin/companies");
  revalidatePath("/portal/dashboard");
  return { success: true };
}
