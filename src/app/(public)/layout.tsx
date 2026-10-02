import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { OrganizationSchema, LocalBusinessSchema } from "@/components/JsonLd";
import { siteConfig } from "@/data/site-config";
import { pageMeta } from "@/data/page-meta";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: pageMeta.home.title,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: pageMeta.home.description,
  authors: [{ name: siteConfig.businessName }],
  creator: siteConfig.businessName,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.businessName,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
      </head>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyCTA />
      <Analytics />
    </>
  );
}
