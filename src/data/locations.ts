export interface Location {
  id: number;
  slug: string;
  name: string;
  city: string;
  county: string;
  state: string;
  stateAbbr: string;
  /** Homepage card blurb. */
  shortDescription: string;
  /** Page intro, under the H1. The page has no meta description (item 16). */
  intro: string;
  isPrimary: boolean;
  population?: number;
}

export const locations: Location[] = [
  {
    id: 1,
    slug: "newport-beach-ca",
    name: "Newport Beach",
    city: "Newport Beach",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Premium fractional CFO and accounting services for Newport Beach businesses seeking strategic financial leadership.",
    intro: "Newport Beach is one of Orange County's premier business communities and a regional center for financial services, healthcare, and professional firms, alongside a growing base of entrepreneurs and fast-growing companies. As a Newport Beach firm, BlueCrest Group provides fractional CFO and accounting services to businesses across the city, from Fashion Island to Corona del Mar and Newport Coast, with the hands-on, in-person support local business owners expect.",
    isPrimary: true,
    population: 85000,
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export function getPrimaryLocation(): Location {
  return locations.find((l) => l.isPrimary) || locations[0];
}

// Map of location slugs to their image file extensions
const locationImageExtensions: Record<string, string> = {
  "newport-beach-ca": "webp",
};

export function getLocationImagePath(location: Location): string {
  const extension = locationImageExtensions[location.slug] || "jpg";
  return `/images/${location.slug}/fractional-cfo-${location.slug}.${extension}`;
}
