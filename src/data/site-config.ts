export const siteConfig = {
  name: "BlueCrest Group",
  businessName: "BlueCrest Group",
  tagline: "Strategic Financial Leadership for Growing Businesses",
  industry: "Fractional CFO and Accounting",

  // Location
  city: "Newport Beach",
  state: "California",
  stateAbbr: "CA",
  region: "Orange County",

  // Contact
  email: "info@bluecrest-group.com",
  url: "https://bluecrest-group.com",
  // Developer Update List item 27. Empty renders nothing.
  phone: "(949) 438-3418" as string,
  // S1: Google Business Profile URL. Empty renders nothing.
  googleBusinessProfileUrl: "" as string,

  // Principal (Developer Update List item 24). Kept as `founder` for the Person schema @id.
  founder: {
    name: "Josh Miller",
    title: "Principal",
    longBio: `Josh is a finance executive with more than 15 years of experience in startups and real estate. He has led finance teams, built financial strategies, and helped companies of all sizes grow.

Over his career, Josh has helped several high-growth startups raise funding, launch products, and scale their operations. He knows the challenges and opportunities that come with building a startup, and he is comfortable working through complex financial issues.

Josh has also held senior finance roles in real estate, where he helped manage complex property portfolios. He brings deep experience in financial modeling, forecasting, and budgeting, and he has led numerous financing and acquisition transactions. He works collaboratively and stays focused on results that matter to owners and investors.`,
    image: "/images/josh-miller.jpg",
  },

  // Business details
  // Cities on the Service Areas hub and in JSON-LD areaServed, in this order (Developer Update List item 14).
  serviceAreaCities: [
    "Newport Beach",
    "Irvine",
    "Costa Mesa",
    "Huntington Beach",
    "Laguna Beach",
    "Orange",
    "Santa Ana",
    "Anaheim",
    "Fullerton",
    "Tustin",
    "Mission Viejo",
    "Lake Forest",
  ],

  // Hours
  hours: "Monday through Friday, 8:00 AM to 6:00 PM",

  // Brand colors (from style guide)
  colors: {
    primaryBlue: "#579cc6",
    primaryGold: "#d69c50",
    accentNavy: "#3e5a81",
    accentCoral: "#d66c4c",
  },
} as const;

export type SiteConfig = typeof siteConfig;
