import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { services } from "@/data/services";
import { staticPages, INSIGHTS_HUB_UPDATED_AT } from "@/data/pages";

export interface SitemapArticle {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}

function url(path: string): string {
  return path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
}

export function buildSitemapEntries(
  articles: SitemapArticle[],
  opts: { insightsEnabled?: boolean } = {}
): MetadataRoute.Sitemap {
  const insightsEnabled = opts.insightsEnabled ?? siteConfig.insightsEnabled;

  const entries: MetadataRoute.Sitemap = [
    ...staticPages.map((p) => ({ url: url(p.path), lastModified: p.updatedAt })),
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), lastModified: s.updatedAt })),
  ];

  if (insightsEnabled) {
    entries.push({ url: url("/insights"), lastModified: INSIGHTS_HUB_UPDATED_AT });
    for (const a of articles) {
      entries.push({ url: url(`/insights/${a.slug}`), lastModified: a.updatedAt ?? a.publishedAt });
    }
  }

  return entries;
}
