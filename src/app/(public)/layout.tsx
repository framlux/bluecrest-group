import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { OrganizationSchema, LocalBusinessSchema } from "@/components/JsonLd";
import { siteConfig } from "@/data/site-config";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.businessName} | Fractional CFO and Accounting Services in ${siteConfig.city}, ${siteConfig.stateAbbr}`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: `${siteConfig.businessName} provides fractional CFO, accounting, and business consulting services for growing businesses in ${siteConfig.city}, ${siteConfig.stateAbbr} and Orange County. Expert financial leadership for companies with $1M+ revenue.`,
  keywords: [
    "fractional CFO",
    "fractional CFO Orange County",
    "outsourced CFO",
    "fractional accounting services",
    "business consulting",
    "Newport Beach CFO",
    "Orange County accounting",
  ],
  authors: [{ name: siteConfig.businessName }],
  creator: siteConfig.businessName,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.businessName,
    title: `${siteConfig.businessName} | Fractional CFO Services`,
    description: `Expert fractional CFO and accounting services for growing businesses in ${siteConfig.city}, ${siteConfig.stateAbbr}.`,
    images: [
      {
        url: "/images/Orange-County-CA-fractional-cfo.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.businessName} - Fractional CFO Services in Orange County, CA`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.businessName,
    description: `Fractional CFO and accounting services in ${siteConfig.city}, ${siteConfig.stateAbbr}.`,
    images: ["/images/Orange-County-CA-fractional-cfo.jpg"],
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
