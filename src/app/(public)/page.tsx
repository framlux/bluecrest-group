import { client, featuredArticlesQuery } from "@/lib/sanity";
import HomePageClient from "@/components/HomePageClient";

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
  try {
    const articles = await client.fetch<Article[]>(featuredArticlesQuery, {}, {
      cache: "force-cache"
    });
    
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
