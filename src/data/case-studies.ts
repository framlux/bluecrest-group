/** Anonymous client case studies (BlueCrest_Case_Studies.docx). No client names, logos, or quotes. */
export interface CaseStudy {
  slug: string;
  /** Full title tag; the brand is already included. */
  title: string;
  description: string;
  h1: string;
  atAGlance: { label: string; value: string }[];
  challenge: string;
  /** Optional sentence before the list. */
  whatWeDidIntro?: string;
  whatWeDid: string[];
  result: string;
  relatedSlugs: string[];
  card: { heading: string; text: string };
  datePublished: string;
  updatedAt: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "yardi-implementation-industrial-real-estate",
    title: "Yardi Implementation Case Study: Industrial Real Estate | BlueCrest Group",
    description: "How BlueCrest Group took an industrial real estate developer from AP tracking alone to full accounting, finance, and reporting on Yardi across 17 entities.",
    h1: "Case Study: Implementing Yardi for an Industrial Real Estate Developer",
    atAGlance: [
      { label: "Client", value: "Industrial real estate developer and investment manager" },
      { label: "Portfolio", value: "About 2.5 million square feet of Class A industrial development across Nevada and Arizona" },
      { label: "Scope", value: "Full Yardi implementation" },
      { label: "Scale", value: "17 entities at the corporate, fund, and property levels" },
      { label: "Result", value: "Full accounting, finance, and reporting capabilities in one system" },
    ],
    challenge: "The company was building a multi-state industrial development platform with no accounting system. Its finance function ran on accounts payable management alone, with no general ledger and no way to produce entity-level financial statements or consolidated reporting across its corporate, fund, and property entities.",
    whatWeDidIntro: "We led a full implementation of Yardi, a real estate accounting and property management platform:",
    whatWeDid: [
      "Designed the chart of accounts for a development company with corporate, fund, and property entities.",
      "Set up 17 entities in the system.",
      "Imported the general ledger and migrated historical data.",
      "Moved accounts payable data and workflows from the prior AP system.",
      "Built approval workflows and financial reporting.",
    ],
    result: "Accounting, finance, and reporting for every corporate, fund, and property entity now run in one system, where before the company only tracked payables.",
    relatedSlugs: ["accounting-system-setup", "fractional-controller-services", "bookkeeping-and-reconciliation"],
    card: {
      heading: "Implementing Yardi for an Industrial Real Estate Developer",
      text: "A full Yardi implementation for a multi-state developer, covering 17 entities and the move off its old AP system.",
    },
    datePublished: "2026-10-20",
    updatedAt: "2026-10-20",
  },
  {
    slug: "multi-location-restaurant-accounting",
    title: "Restaurant Accounting Case Study: Multi-Location Cleanup | BlueCrest Group",
    description: "How BlueCrest Group cleaned up two years of books and built expense tracking, payroll, and sales tax processes for a restaurant owner expanding to three locations.",
    h1: "Case Study: Accounting for a Restaurant Owner Expanding to Three Locations",
    atAGlance: [
      { label: "Client", value: "Restaurant owner and operator" },
      { label: "Scale", value: "Grew from one restaurant to three" },
      { label: "Scope", value: "Two years of bookkeeping cleanup, owner basis calculation, sales tax process improvement, multi-location expense allocation, and payroll implementation" },
      { label: "Result", value: "Profitability measured restaurant by restaurant" },
    ],
    challenge: "The owner was opening two more restaurants while his existing books were two years behind. He couldn't see how each location was performing, his owner basis had never been calculated, his sales tax process needed improvement, and he had no system for allocating shared expenses or running payroll across multiple restaurants.",
    whatWeDid: [
      "Cleaned up and reconciled two years of past books.",
      "Calculated the owner's basis.",
      "Improved the sales tax process.",
      "Built a system to allocate and track expenses across all three restaurants.",
      "Implemented payroll across every location.",
    ],
    result: "The owner now sees how each restaurant is performing and can make changes at one location based on its own numbers. His books are current, and payroll and expenses are handled the same way at all three.",
    relatedSlugs: ["bookkeeping-and-reconciliation", "sales-tax-compliance", "tax-strategy-planning"],
    card: {
      heading: "Accounting for a Restaurant Owner Expanding to Three Locations",
      text: "Two years of books cleaned up, plus expense tracking, payroll, and sales tax processes that show profitability restaurant by restaurant.",
    },
    datePublished: "2026-10-20",
    updatedAt: "2026-10-20",
  },
  {
    slug: "ecommerce-inventory-profitability-tracking",
    title: "E-Commerce Accounting Case Study: Inventory and Profitability | BlueCrest Group",
    description: "How BlueCrest Group built accounting systems, inventory processes, and profitability KPIs for an e-commerce company that grew to over $100,000 in monthly revenue in under six months.",
    h1: "Case Study: Building the Finance Function for a Fast-Growing E-Commerce Company",
    atAGlance: [
      { label: "Client", value: "E-commerce company" },
      { label: "Growth", value: "From zero revenue to over $100,000 per month in under six months" },
      { label: "Scope", value: "Accounting system setup, inventory management processes, and profitability KPIs" },
      { label: "Result", value: "Accounting system, inventory processes, and profitability KPIs in place as sales passed $100,000 a month" },
    ],
    challenge: "The company was launching from zero revenue and needed financial infrastructure that could keep up with fast growth: an accounting system, a reliable way to track inventory, and visibility into what was actually profitable.",
    whatWeDid: [
      "Set up the company's accounting systems.",
      "Implemented inventory management processes.",
      "Built KPIs to track profitability.",
    ],
    result: "The accounting system, inventory processes, and profitability KPIs were in place from launch. The company grew past $100,000 in monthly revenue in under six months, and the owners could see what was profitable along the way.",
    relatedSlugs: ["accounting-system-setup", "bookkeeping-and-reconciliation", "financial-planning-and-analysis"],
    card: {
      heading: "Building the Finance Function for a Fast-Growing E-Commerce Company",
      text: "New accounting systems, inventory processes, and profitability KPIs for a company that grew to over $100,000 in monthly revenue in under six months.",
    },
    datePublished: "2026-10-20",
    updatedAt: "2026-10-20",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
