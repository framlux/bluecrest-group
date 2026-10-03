import { siteConfig } from "@/data/site-config";
import type { PageMetadataInput } from "@/lib/metadata";

export interface ArticleForMeta {
  title: string;
  slug: string;
  excerpt?: string;
  seoDescription?: string;
  publishedAt: string;
  updatedAt?: string;
  ogImageUrl?: string;
}

const DEFAULT_ARTICLE_DESCRIPTION =
  "Financial strategy and fractional CFO insights from BlueCrest Group in Newport Beach, CA.";

export function articleMetadataInput(
  article: ArticleForMeta,
  insightsEnabled: boolean = siteConfig.insightsEnabled
): PageMetadataInput {
  return {
    title: article.title,
    description: article.seoDescription || article.excerpt || DEFAULT_ARTICLE_DESCRIPTION,
    path: `/insights/${article.slug}`,
    image: article.ogImageUrl
      ? { url: article.ogImageUrl, width: 1200, height: 630, alt: article.title }
      : undefined,
    type: "article",
    noindex: !insightsEnabled,
  };
}

/** T4: /insights is indexable only when switched on and it has content. */
export function shouldIndexInsights(
  articleCount: number,
  insightsEnabled: boolean = siteConfig.insightsEnabled
): boolean {
  return insightsEnabled && articleCount > 0;
}
