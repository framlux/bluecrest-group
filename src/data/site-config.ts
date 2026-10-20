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
    longBio: `Josh is a dynamic and results driven financial executive with over 15 years of experience in start up and real estate industries. He has a track record of success in leading finance teams, developing financial strategies, and driving growth for companies of all sizes.

Throughout his career, Josh has been instrumental in the success of several high growth start ups, helping to secure funding, launch products, and scale operations. He has a deep understanding of the unique challenges and opportunities that come with building a successful start up and has honed his ability to navigate complex financial issues with ease.

In addition to his experience in start ups, Josh has also held senior financial positions in the real estate industry, where he has played a key role in the management of complex real estate portfolios. He has extensive experience in financial modeling, forecasting, and budgeting, and has successfully led numerous financing and acquisition transactions. His strategic approach to finance has been instrumental in the growth and success of the companies he has worked with, and he is committed to driving results through collaboration, innovation, and a relentless focus on delivering value to stakeholders.`,
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
