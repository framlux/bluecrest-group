import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { services } from "@/data/services";
import { staticPages } from "@/data/pages";
import { caseStudies } from "@/data/case-studies";

function url(path: string): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map((p) => ({ url: url(p.path), lastModified: p.updatedAt })),
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), lastModified: s.updatedAt })),
    ...caseStudies.map((c) => ({ url: url(`/case-studies/${c.slug}`), lastModified: c.updatedAt })),
  ];
}
