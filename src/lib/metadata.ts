import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

export const DEFAULT_OG_IMAGE = {
  url: "/og-image-1200x630.png",
  width: 1200,
  height: 630,
  alt: "BlueCrest Group logo",
};

const BRAND_SUFFIX = ` | ${siteConfig.businessName}`;

export interface PageMetadataInput {
  /** Page phrase only. The layout template appends the brand. */
  title: string;
  description: string;
  /** Root-relative path, e.g. "/about". Resolved against metadataBase. */
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  noindex?: boolean;
  /** Title is already complete (homepage). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
}

export function fullTitle(title: string, absolute = false): string {
  return absolute ? title : `${title}${BRAND_SUFFIX}`;
}

function canonicalPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error(`buildMetadata: path must be root-relative, got "${path}"`);
  }
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}

/**
 * One place that sets title, description, canonical, og:* and twitter:* together.
 * A page that sets openGraph replaces the layout's whole openGraph object, so
 * siteName/type/locale/images are always included here.
 */
export function buildMetadata(input: PageMetadataInput): Metadata {
  const path = canonicalPath(input.path);
  const socialTitle = fullTitle(input.title, input.absoluteTitle);
  const image = input.image ?? DEFAULT_OG_IMAGE;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: path },
    openGraph: {
      type: input.type ?? "website",
      locale: "en_US",
      siteName: siteConfig.businessName,
      url: path,
      title: socialTitle,
      description: input.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: input.description,
      images: [image.url],
    },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
