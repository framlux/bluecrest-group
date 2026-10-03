import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { fetchSanity, urlFor, articleBySlugQuery, articleSlugsQuery } from "@/lib/sanity";
import { portableTextComponents } from "@/components/PortableTextComponents";
import { buildMetadata } from "@/lib/metadata";
import { pageMeta } from "@/data/page-meta";
import { articleMetadataInput } from "@/lib/insights";
import { getServiceBySlug } from "@/data/services";
import { JsonLd } from "@/components/JsonLd";
import ContactCta from "@/components/ContactCta";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";

export const revalidate = 300; // keep equal to SANITY_REVALIDATE_SECONDS

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  seoDescription?: string;
  updatedAt?: string;
  relatedService?: string;
  ogImage?: {
    [key: string]: unknown;
  };
  body?: Array<{
    _type: string;
    [key: string]: unknown;
  }>;
  mainImage?: {
    alt?: string;
    [key: string]: unknown;
  };
  author?: {
    _id: string;
    name: string;
    image?: {
      [key: string]: unknown;
    };
    bio?: string;
  };
  publishedAt: string;
  category?: string;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const article = await fetchSanity<Article | null>(articleBySlugQuery, { slug });
    return article;
  } catch (error) {
    console.error("Failed to fetch article", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await fetchSanity<{ slug: string }[]>(articleSlugsQuery);
    return slugs.map((item) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: pageMeta.notFound.title };
  }
  const ogSource = article.ogImage ?? article.mainImage;
  return buildMetadata(articleMetadataInput({
    title: article.title,
    slug: article.slug.current,
    excerpt: article.excerpt,
    seoDescription: article.seoDescription,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    ogImageUrl: ogSource ? urlFor(ogSource).width(1200).height(630).url() : undefined,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const heroImageUrl = article.mainImage
    ? urlFor(article.mainImage).width(1600).quality(80).format("webp").url()
    : undefined;

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const updatedDate = article.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : undefined;
  const relatedService = article.relatedService ? getServiceBySlug(article.relatedService) : undefined;
  const path = `/insights/${article.slug.current}`;
  const description = article.seoDescription || article.excerpt || article.title;

  return (
    <div className="bg-white min-h-screen">
      <JsonLd data={[
        articleSchema({ headline: article.title, description, path, image: heroImageUrl, datePublished: article.publishedAt, dateModified: article.updatedAt }),
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: article.title, path }]),
      ]} />
      {/* Hero Section */}
      {heroImageUrl && (
        <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
          <Image
            src={heroImageUrl}
            alt={article.mainImage?.alt || article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </section>
      )}

      {/* Article Content */}
      <article className="relative bg-white">
        <div className={`${heroImageUrl ? "-mt-32 relative z-10" : "pt-32"}`}>
          <header className="max-w-4xl mx-auto px-6 md:px-8 pt-12 pb-8 bg-white rounded-t-3xl">
            {/* Category & Date Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <Link
                href="/insights"
                className="inline-flex items-center text-[var(--color-brand-blue)] hover:text-[var(--color-brand-navy)] font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                All Insights
              </Link>
              {article.category && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="inline-block bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-xs font-bold px-3 py-1 rounded-full">
                    {article.category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                  </span>
                </>
              )}
              <span className="text-gray-300">|</span>
              <time dateTime={article.publishedAt} className="text-xs uppercase tracking-wide text-gray-500">
                {publishedDate}
              </time>
              {updatedDate && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs uppercase tracking-wide text-gray-500">Updated {updatedDate}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-brand-navy)] leading-tight mb-8">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Author */}
            {article.author && (
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                {article.author.image ? (
                  <Image
                    src={urlFor(article.author.image).width(64).height(64).url()}
                    alt={article.author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-navy)] flex items-center justify-center text-white text-xl font-bold">
                    {article.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{article.author.name}</p>
                  {article.author.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{article.author.bio}</p>
                  )}
                </div>
              </div>
            )}
          </header>
        </div>

        {/* Article Body */}
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
          {article.body && article.body.length > 0 && (
            <div className="prose prose-lg max-w-none">
              <PortableText value={article.body} components={portableTextComponents} />
            </div>
          )}
          {relatedService && (
            <p className="mt-12 pt-8 border-t border-gray-100 text-lg">
              Related service:{" "}
              <Link href={`/services/${relatedService.slug}`} className="text-[var(--color-brand-blue)] font-semibold hover:underline">
                {relatedService.name}
              </Link>
            </p>
          )}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 md:px-8 pb-12">
          <div className="bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--color-navy-dark)] rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Financial Operations?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how our fractional CFO services can help your business thrive with clarity and confidence.
            </p>
            <ContactCta className="btn-primary px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2" />
          </div>
        </div>

        {/* Back Link */}
        <div className="max-w-4xl mx-auto px-6 md:px-8 pb-20">
          <div className="pt-8 border-t border-gray-100">
            <Link
              href="/insights"
              className="inline-flex items-center gap-3 text-[var(--color-brand-blue)] hover:text-[var(--color-brand-navy)] font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Insights
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
