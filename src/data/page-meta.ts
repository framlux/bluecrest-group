import { siteConfig } from "@/data/site-config";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}

const { businessName, city, stateAbbr, region, founder } = siteConfig;

export const pageMeta = {
  home: {
    path: "/",
    title: `${businessName} | Fractional CFO in ${city}, ${stateAbbr}`,
    absoluteTitle: true,
    description: `${businessName} provides fractional CFO and accounting services for small and growing businesses in ${city}, ${stateAbbr} and ${region}, from clean books to executive-level finance.`,
  },
  about: {
    path: "/about",
    title: `About ${founder.name}, Fractional CFO`,
    description: `Learn about ${businessName} and principal ${founder.name}. We provide fractional CFO and accounting services to small and growing businesses in ${region}.`,
  },
  contact: {
    path: "/contact",
    title: "Contact Us",
    description: `Contact ${businessName} to schedule a free 15-minute consultation about fractional CFO and accounting services in ${city} and ${region}.`,
  },
  services: {
    path: "/services",
    title: "Fractional CFO and Accounting Services",
    description: `Explore fractional CFO, accounting, and tax planning services for small and growing businesses in ${city}, ${stateAbbr} and ${region}.`,
  },
  serviceAreas: {
    path: "/service-areas",
    title: "Orange County Fractional CFO & Accounting",
    description: `Based in ${city}, ${businessName} provides fractional CFO and accounting services to businesses throughout ${region} and Southern California.`,
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
    description: `Privacy policy for ${businessName}. Learn how we collect, use, and protect your personal information.`,
  },
  terms: {
    path: "/terms",
    title: "Terms of Service",
    description: `Terms of service for ${businessName}. Review our terms and conditions for using our fractional CFO and accounting services.`,
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you are looking for could not be found.",
  },
} satisfies Record<string, PageMeta | { title: string; description: string }>;
