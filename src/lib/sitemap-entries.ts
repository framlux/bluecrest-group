import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { services } from "@/data/services";
import { staticPages } from "@/data/pages";

function url(path: string): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map((p) => ({ url: url(p.path), lastModified: p.updatedAt })),
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), lastModified: s.updatedAt })),
  ];
}
