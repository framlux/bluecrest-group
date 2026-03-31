import { getAllUsers, getAllCompanies } from "@/lib/db/queries";
import UsersClient from "./UsersClient";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const [allUsers, allCompanies] = await Promise.all([
    getAllUsers(),
    getAllCompanies(),
  ]);

  return (
    <UsersClient
      users={allUsers}
      companies={allCompanies.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
