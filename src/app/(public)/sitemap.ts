import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { fetchSanity, articleSitemapQuery } from "@/lib/sanity";
import { buildSitemapEntries, type SitemapArticle } from "@/lib/sitemap-entries";

export const revalidate = 300; // keep equal to SANITY_REVALIDATE_SECONDS

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: SitemapArticle[] = [];
  if (siteConfig.insightsEnabled && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      articles = await fetchSanity<SitemapArticle[]>(articleSitemapQuery);
    } catch (error) {
      console.error("Failed to fetch articles for sitemap", error);
    }
  }
  return buildSitemapEntries(articles);
}
