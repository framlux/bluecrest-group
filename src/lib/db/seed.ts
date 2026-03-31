import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "./schema";
import { eq } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  const adminEmail = "info@bluecrest-group.com";

  // Check if admin already exists
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Admin user ${adminEmail} already exists, skipping.`);
  } else {
    await db.insert(users).values({
      email: adminEmail,
      name: "BlueCrest Admin",
      role: "admin",
      emailVerified: new Date(),
    });
    console.log(`Created admin user: ${adminEmail}`);
  }

  await client.end();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
