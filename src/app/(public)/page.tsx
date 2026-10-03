import type { Metadata } from "next";
import { fetchSanity, featuredArticlesQuery } from "@/lib/sanity";
import HomePageClient from "@/components/HomePageClient";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { siteConfig } from "@/data/site-config";

export const revalidate = 300; // keep equal to SANITY_REVALIDATE_SECONDS

export const metadata: Metadata = buildMetadata(pageMeta.home);

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: {
    alt?: string;
    [key: string]: unknown;
  };
  publishedAt: string;
  publishedDateFormatted?: string; // Pre-formatted on server
  category?: string;
}

async function getFeaturedArticles(): Promise<Article[]> {
  if (!siteConfig.insightsEnabled) return [];
  try {
    const articles = await fetchSanity<Article[]>(featuredArticlesQuery);

    // Format dates on server to prevent hydration mismatches
    return (articles || []).map(article => ({
      ...article,
      publishedDateFormatted: article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch featured articles", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredArticles = await getFeaturedArticles();
  
  return <HomePageClient featuredArticles={featuredArticles} />;
}
