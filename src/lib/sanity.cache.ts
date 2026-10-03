/** Tag on every Sanity fetch; the publish webhook revalidates it (spec §3.6). */
export const SANITY_CACHE_TAG = "sanity";
/** Fallback refresh interval if a webhook is missed. Route segments repeat this as a literal `300`. */
export const SANITY_REVALIDATE_SECONDS = 300;
