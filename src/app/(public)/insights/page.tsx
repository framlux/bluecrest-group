import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, articlesQuery, urlFor } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Insights — BlueCrest Group | Financial Strategy & CFO Expertise",
  description:
    "Expert insights on financial strategy, business growth, tax planning, and CFO best practices from BlueCrest Group's leadership team.",
  openGraph: {
    title: "Insights — BlueCrest Group",
    description:
      "Financial strategy insights, CFO expertise, and business growth guidance from Orange County's trusted fractional CFO services.",
    images: [
      {
        url: "/images/Orange-County-CA-fractional-cfo.jpg",
        width: 1200,
        height: 630,
        alt: "BlueCrest Group Insights",
      },
    ],
  },
};

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
  category?: string;
  author?: {
    name: string;
    image?: {
      [key: string]: unknown;
    };
  };
}

async function getArticles(): Promise<Article[]> {
  try {
    const articles = await client.fetch<Article[]>(articlesQuery);
    return articles || [];
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return [];
  }
}

export default async function InsightsPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24 relative overflow-hidden">
        <Image
          src="/bluecrest-group-blog-hero.jpg"
          alt="BlueCrest Group Insights"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-12 h-0.5 bg-[var(--color-brand-gold)]"></span>
              <span className="text-[var(--color-brand-gold)] font-semibold text-sm uppercase tracking-wider">
                Expert Perspectives
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold !text-white leading-tight mb-6">
              Financial Insights
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Strategic guidance, industry expertise, and actionable insights to help your business thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Insights Coming Soon
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We&apos;re preparing valuable content on financial strategy, business growth, and CFO best practices. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const imageUrl = article.mainImage
                  ? urlFor(article.mainImage).width(800).height(500).quality(80).format("webp").url()
                  : "/images/Orange-County-CA-fractional-cfo.jpg";

                const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <Link
                    key={article._id}
                    href={`/insights/${article.slug.current}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={article.mainImage?.alt || article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {article.category && (
                        <span className="absolute top-4 left-4 bg-[var(--color-brand-gold)] text-white text-xs font-bold px-3 py-1 rounded-full">
                          {article.category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <time className="text-xs text-gray-500 uppercase tracking-wide">
                        {publishedDate}
                      </time>
                      <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-[var(--color-brand-blue)] transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-[var(--color-brand-blue)] font-semibold text-sm group-hover:gap-3 transition-all gap-2">
                        Read More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
