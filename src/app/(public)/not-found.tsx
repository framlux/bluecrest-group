import type { Metadata } from "next";
import { pageMeta } from "@/data/page-meta";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: pageMeta.notFound.title,
  description: pageMeta.notFound.description,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent />;
}
