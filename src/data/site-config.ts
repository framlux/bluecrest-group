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
  website: "www.bluecrest-group.com",

  // Founder
  founder: {
    name: "Josh Miller",
    title: "Founder and CEO",
    shortBio: "As a seasoned financial leader with over 15 years of experience, Josh has a proven track record of driving growth and profitability for companies across a diverse range of industries. His expertise in strategic financial planning, risk management, and investor relations has been instrumental in supporting business success and creating long term value for stakeholders.",
    longBio: `Josh is a dynamic and results driven financial executive with over 15 years of experience in start up and real estate industries. He has a track record of success in leading finance teams, developing financial strategies, and driving growth for companies of all sizes.

Throughout his career, Josh has been instrumental in the success of several high growth start ups, helping to secure funding, launch products, and scale operations. He has a deep understanding of the unique challenges and opportunities that come with building a successful start up and has honed his ability to navigate complex financial issues with ease.

In addition to his experience in start ups, Josh has also held senior financial positions in the real estate industry, where he has played a key role in the management of complex real estate portfolios. He has extensive experience in financial modeling, forecasting, and budgeting, and has successfully led numerous financing and acquisition transactions. His strategic approach to finance has been instrumental in the growth and success of the companies he has worked with, and he is committed to driving results through collaboration, innovation, and a relentless focus on delivering value to stakeholders.`,
    image: "/images/josh-miller.jpg",
  },

  // Business details
  targetRevenue: "$1M+",
  serviceArea: "Orange County and Southern California",

  // Hours
  hours: "Monday through Friday, 8:00 AM to 6:00 PM",

  // Brand colors (from style guide)
  colors: {
    primaryBlue: "#579cc6",
    primaryGold: "#d69c50",
    accentNavy: "#3e5a81",
    accentCoral: "#d66c4c",
  },

  // Core values
  values: [
    {
      title: "Trust",
      description: "The foundation of every relationship we build, established through transparency, consistency, and sound financial judgment.",
    },
    {
      title: "Value",
      description: "Delivering clear insights that lead to measurable business impact rather than unnecessary complexity.",
    },
    {
      title: "Being Heard",
      description: "Taking time to understand each client's challenges, priorities, and long term vision to ensure strategies align with real business goals.",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
