import { siteConfig } from "@/data/site-config";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata";

export type JsonLdObject = Record<string, unknown>;

export const LOGO_PATH = "/logo-square-512.png";
/** Wide and square previews, so search engines can pick the aspect ratio they need. */
export const SCHEMA_IMAGE_PATHS = [DEFAULT_OG_IMAGE.url, "/og-image-square-1200.png"];

export const BUSINESS_ID = `${siteConfig.url}/#business`;
export const FOUNDER_ID = `${siteConfig.url}/about#josh-miller`;

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

const CONTEXT = "https://schema.org";

export function businessSchema(): JsonLdObject {
  const schema: JsonLdObject = {
    "@context": CONTEXT,
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: siteConfig.businessName,
    description: `${siteConfig.businessName} provides fractional CFO, accounting, and business advisory services to growing businesses in ${siteConfig.region}.`,
    url: siteConfig.url,
    logo: absoluteUrl(LOGO_PATH),
    image: SCHEMA_IMAGE_PATHS.map(absoluteUrl),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.stateAbbr,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: `${siteConfig.region}, ${siteConfig.stateAbbr}` },
      ...siteConfig.serviceAreaCities.map((city) => ({ "@type": "City", name: `${city}, ${siteConfig.stateAbbr}` })),
    ],
    founder: { "@type": "Person", "@id": FOUNDER_ID, name: siteConfig.founder.name, url: absoluteUrl("/about") },
    // Matches the hours shown on the Contact page.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  };
  if (siteConfig.phone) schema.telephone = siteConfig.phone;
  if (siteConfig.googleBusinessProfileUrl) schema.sameAs = [siteConfig.googleBusinessProfileUrl];
  return schema;
}

export function personSchema(): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.title,
    image: absoluteUrl(siteConfig.founder.image),
    worksFor: { "@id": BUSINESS_ID },
  };
}

export function serviceSchema(input: { name: string; description: string; path: string }): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "AdministrativeArea", name: `${siteConfig.region}, ${siteConfig.stateAbbr}` },
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    image: SCHEMA_IMAGE_PATHS.map(absoluteUrl),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@type": "Organization", "@id": BUSINESS_ID, name: siteConfig.businessName, url: siteConfig.url },
    publisher: { "@id": BUSINESS_ID },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** JSON for a <script> tag: escapes "<" so content can never close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
