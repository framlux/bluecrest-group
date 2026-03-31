import { getAllCompanies } from "@/lib/db/queries";
import CompaniesClient from "./CompaniesClient";

export const metadata = { title: "Companies" };

export default async function CompaniesPage() {
  const allCompanies = await getAllCompanies();

  return <CompaniesClient companies={allCompanies} />;
}
