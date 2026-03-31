"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, companyAccess } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendMagicLinkEmail } from "@/lib/email/magic-link";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function inviteUser(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "admin" | "client";
  const companyIds = formData.getAll("companyIds") as string[];

  if (!email) return { error: "Email is required" };
  if (!name) return { error: "Name is required" };

  // Check if user already exists
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return { error: "A user with this email already exists" };
  }

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      role: role || "client",
      emailVerified: new Date(),
    })
    .returning({ id: users.id });

  // Create company access entries
  if (companyIds.length > 0) {
    await db.insert(companyAccess).values(
      companyIds.map((companyId) => ({
        userId: newUser.id,
        companyId,
      }))
    );
  }

  // Send welcome magic link email
  try {
    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const loginUrl = `${baseUrl}/portal/login`;
    await sendMagicLinkEmail(email, loginUrl);
  } catch (err) {
    console.error("Failed to send invite email:", err);
  }

  revalidatePath("/portal/admin/users");
  return { success: true };
}

export async function updateUser(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const role = formData.get("role") as "admin" | "client";

  if (!name) return { error: "Name is required" };

  await db
    .update(users)
    .set({ name, role: role || "client", updatedAt: new Date() })
    .where(eq(users.id, id));

  revalidatePath("/portal/admin/users");
  return { success: true };
}

export async function removeUser(id: string) {
  await requireAdmin();

  await db.delete(users).where(eq(users.id, id));

  revalidatePath("/portal/admin/users");
  return { success: true };
}
