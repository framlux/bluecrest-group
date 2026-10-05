import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";

export const metadata: Metadata = buildMetadata(pageMeta.home);

export default function HomePage() {
  return <HomePageClient />;
}
