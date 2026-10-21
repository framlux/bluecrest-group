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
    shortDescription: "In-person support for businesses from Fashion Island to Newport Coast.",
    intro: "We're based in Newport Beach and work with businesses across the city, from Fashion Island to Corona del Mar and Newport Coast. Much of the local economy is professional firms, healthcare practices, and owner-run companies, and those are the businesses we know best. We're glad to meet in person, and we handle everything else remotely.",
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
