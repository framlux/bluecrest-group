import { sanityClient } from "./sanity.client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

// Re-export the cached fetch helper so no caller can bypass the cache settings
export { fetchSanity } from "./sanity.client";

// Image URL builder
const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ═══════════════════════════════════════════════════════════════════════════════
// INSIGHTS QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

export const articlesQuery = `*[_type == "article" && defined(slug.current)]
  | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    mainImage{
      ...,
      alt
    },
    publishedAt,
    category,
    author->{
      name,
      image
    }
  }`;

export const featuredArticlesQuery = `*[_type == "article" && isFeatured == true && defined(slug.current)]
  | order(publishedAt desc)[0..2]{
    _id,
    title,
    slug,
    excerpt,
    mainImage{
      ...,
      alt
    },
    publishedAt,
    category,
    author->{
      name,
      image
    }
  }`;

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  seoDescription,
  updatedAt,
  relatedService,
  ogImage,
  body,
  mainImage{
    ...,
    alt
  },
  author->{
    _id,
    name,
    image,
    bio
  },
  publishedAt,
  category,
  isFeatured
}`;

export const articleSlugsQuery = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current
}`;

export const articleSitemapQuery = `*[_type == "article" && defined(slug.current)]{
  "slug": slug.current,
  publishedAt,
  updatedAt
}`;
