import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import NotFoundContent from "@/components/NotFoundContent";
import { siteConfig } from "@/data/site-config";
import { pageMeta } from "@/data/page-meta";

// The root layout has no title template, so the suffix is added here.
export const metadata: Metadata = {
  title: { absolute: `${pageMeta.notFound.title} | ${siteConfig.businessName}` },
  description: pageMeta.notFound.description,
  robots: { index: false, follow: true },
};

// Unknown URLs never reach a route group, so this repeats the (public) layout chrome.
export default function RootNotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
