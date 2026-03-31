"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { companyAccess } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function grantAccess(userId: string, companyId: string) {
  await requireAdmin();

  // Check if already exists
  const existing = await db
    .select({ id: companyAccess.id })
    .from(companyAccess)
    .where(
      and(
        eq(companyAccess.userId, userId),
        eq(companyAccess.companyId, companyId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return { error: "User already has access to this company" };
  }

  await db.insert(companyAccess).values({ userId, companyId });

  revalidatePath(`/portal/admin/companies/${companyId}`);
  revalidatePath("/portal/dashboard");
  return { success: true };
}

export async function revokeAccess(userId: string, companyId: string) {
  await requireAdmin();

  await db
    .delete(companyAccess)
    .where(
      and(
        eq(companyAccess.userId, userId),
        eq(companyAccess.companyId, companyId)
      )
    );

  revalidatePath(`/portal/admin/companies/${companyId}`);
  revalidatePath("/portal/dashboard");
  return { success: true };
}
