export interface Location {
  id: number;
  slug: string;
  name: string;
  city: string;
  county: string;
  state: string;
  stateAbbr: string;
  shortDescription: string;
  metaDescription?: string;
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
    isPrimary: true,
    population: 85000,
  },
  {
    id: 2,
    slug: "irvine-ca",
    name: "Irvine",
    city: "Irvine",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Expert fractional CFO services for Irvine tech companies, startups, and growing enterprises.",
    isPrimary: false,
    population: 310000,
  },
  {
    id: 3,
    slug: "costa-mesa-ca",
    name: "Costa Mesa",
    city: "Costa Mesa",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Trusted fractional accounting and CFO services for Costa Mesa businesses ready to scale.",
    isPrimary: false,
    population: 115000,
  },
  {
    id: 4,
    slug: "huntington-beach-ca",
    name: "Huntington Beach",
    city: "Huntington Beach",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Strategic financial leadership for Huntington Beach companies seeking growth and profitability.",
    isPrimary: false,
    population: 200000,
  },
  {
    id: 5,
    slug: "laguna-beach-ca",
    name: "Laguna Beach",
    city: "Laguna Beach",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Boutique fractional CFO services for Laguna Beach businesses and creative enterprises.",
    isPrimary: false,
    population: 23000,
  },
  {
    id: 6,
    slug: "orange-ca",
    name: "Orange",
    city: "Orange",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Reliable fractional accounting services for Orange businesses seeking financial clarity.",
    isPrimary: false,
    population: 140000,
  },
  {
    id: 7,
    slug: "santa-ana-ca",
    name: "Santa Ana",
    city: "Santa Ana",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Comprehensive CFO and accounting services for Santa Ana companies at every growth stage.",
    isPrimary: false,
    population: 310000,
  },
  {
    id: 8,
    slug: "anaheim-ca",
    name: "Anaheim",
    city: "Anaheim",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Professional fractional CFO services for Anaheim businesses seeking strategic financial guidance.",
    isPrimary: false,
    population: 350000,
  },
  {
    id: 9,
    slug: "fullerton-ca",
    name: "Fullerton",
    city: "Fullerton",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Expert financial leadership and accounting services for Fullerton area businesses.",
    isPrimary: false,
    population: 140000,
  },
  {
    id: 10,
    slug: "tustin-ca",
    name: "Tustin",
    city: "Tustin",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Fractional CFO and controller services for Tustin companies ready for structured finance.",
    isPrimary: false,
    population: 80000,
  },
  {
    id: 11,
    slug: "mission-viejo-ca",
    name: "Mission Viejo",
    city: "Mission Viejo",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Strategic accounting and CFO services for Mission Viejo businesses and entrepreneurs.",
    isPrimary: false,
    population: 95000,
  },
  {
    id: 12,
    slug: "lake-forest-ca",
    name: "Lake Forest",
    city: "Lake Forest",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Professional fractional finance services for Lake Forest companies seeking growth.",
    isPrimary: false,
    population: 85000,
  },
  {
    id: 13,
    slug: "corona-del-mar-ca",
    name: "Corona del Mar",
    city: "Corona del Mar",
    county: "Orange County",
    state: "California",
    stateAbbr: "CA",
    shortDescription: "Premium fractional CFO services for Corona del Mar businesses and high-net-worth enterprises.",
    isPrimary: false,
    population: 12000,
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export function getPrimaryLocation(): Location {
  return locations.find((l) => l.isPrimary) || locations[0];
}

export function getNearbyLocations(currentSlug: string, limit = 5): Location[] {
  return locations.filter((l) => l.slug !== currentSlug).slice(0, limit);
}

export function getLocationsByPopulation(limit?: number): Location[] {
  const sorted = [...locations].sort((a, b) => (b.population || 0) - (a.population || 0));
  return limit ? sorted.slice(0, limit) : sorted;
}

// Map of location slugs to their image file extensions
const locationImageExtensions: Record<string, string> = {
  "newport-beach-ca": "webp",
  "irvine-ca": "jpg",
  "costa-mesa-ca": "jpg",
  "huntington-beach-ca": "jpg",
  "laguna-beach-ca": "jpg",
  "orange-ca": "jpg",
  "santa-ana-ca": "jpg",
  "anaheim-ca": "webp",
  "fullerton-ca": "jpg",
  "tustin-ca": "avif",
  "mission-viejo-ca": "avif",
  "lake-forest-ca": "jpg",
  "corona-del-mar-ca": "jpg",
};

export function getLocationImagePath(location: Location): string {
  const extension = locationImageExtensions[location.slug] || "jpg";
  return `/images/${location.slug}/fractional-cfo-${location.slug}.${extension}`;
}
