"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { financialPeriods, pnlLineItems } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { parseQboPnl } from "@/lib/import/qbo-parser";
import { checkDuplicatePeriod, validateAmounts } from "@/lib/import/validators";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function importFinancialData(formData: FormData) {
  const session = await requireAdmin();

  const companyId = formData.get("companyId") as string;
  const periodStartStr = formData.get("periodStart") as string;
  const periodEndStr = formData.get("periodEnd") as string;
  const file = formData.get("file") as File;

  if (!companyId) return { error: "Company is required" };
  if (!periodStartStr || !periodEndStr) return { error: "Period dates are required" };
  if (!file) return { error: "File is required" };

  const periodStart = new Date(periodStartStr);
  const periodEnd = new Date(periodEndStr);

  if (periodEnd <= periodStart) {
    return { error: "End date must be after start date" };
  }

  // Check for duplicate period
  const isDuplicate = await checkDuplicatePeriod(
    companyId,
    periodStart,
    periodEnd
  );
  if (isDuplicate) {
    return {
      error:
        "A period overlapping these dates already exists for this company.",
    };
  }

  // Parse the file server-side
  const buffer = await file.arrayBuffer();
  const parsed = parseQboPnl(buffer);

  if (parsed.items.length === 0) {
    return { error: "No data could be parsed from the file." };
  }

  // Validate amounts
  const validation = validateAmounts(parsed.items);
  if (!validation.valid) {
    return { error: `Invalid data: ${validation.errors.join(", ")}` };
  }

  // Insert in a transaction
  const [period] = await db
    .insert(financialPeriods)
    .values({
      companyId,
      periodStart,
      periodEnd,
      importedBy: session.user.id,
    })
    .returning({ id: financialPeriods.id });

  // Batch insert line items
  if (parsed.items.length > 0) {
    await db.insert(pnlLineItems).values(
      parsed.items.map((item) => ({
        periodId: period.id,
        category: item.category,
        subcategory: item.subcategory,
        amount: item.amount.toFixed(2),
        lineOrder: item.lineOrder,
      }))
    );
  }

  revalidatePath("/portal/dashboard");
  revalidatePath(`/portal/companies/${companyId}`);

  return {
    success: true,
    count: parsed.items.length,
    warnings: parsed.warnings,
  };
}
