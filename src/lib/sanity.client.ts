import { createClient } from "@sanity/client";
import { SANITY_CACHE_TAG, SANITY_REVALIDATE_SECONDS } from "./sanity.cache";

export { SANITY_CACHE_TAG, SANITY_REVALIDATE_SECONDS };

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true, // Always use CDN for better performance
  perspective: "published",
});

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate: SANITY_REVALIDATE_SECONDS, tags: [SANITY_CACHE_TAG] },
  });
}
