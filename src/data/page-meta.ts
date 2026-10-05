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
    description: `${businessName} provides fractional CFO, accounting, and business consulting services for growing businesses in ${city}, ${stateAbbr} and ${region}. Expert financial leadership for companies with $1M+ revenue.`,
  },
  about: {
    path: "/about",
    title: `About ${founder.name}, Fractional CFO`,
    description: `Learn about ${businessName} and founder ${founder.name}. We provide fractional CFO and accounting services to growing businesses in ${region}.`,
  },
  contact: {
    path: "/contact",
    title: "Contact Us",
    description: `Contact ${businessName} for fractional CFO and accounting services in ${city} and ${region}. Send us a message and we will be in touch.`,
  },
  services: {
    path: "/services",
    title: "Fractional CFO and Accounting Services",
    description: `Explore our fractional CFO, accounting, and business consulting services for growing businesses in ${city}, ${stateAbbr} and ${region}.`,
  },
  serviceAreas: {
    path: "/service-areas",
    title: "Service Areas",
    description: `From ${city}, ${businessName} provides fractional CFO, accounting, and business advisory services to businesses throughout ${region}, California.`,
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
