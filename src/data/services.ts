export interface Service {
  slug: string;
  /** Menu label and H1/title phrase (Developer Update List item 4). */
  name: string;
  /** Services page card text. */
  shortDescription: string;
  /** Fills "discuss your ___ needs" on the page's Get Started form. */
  consultationPhrase: string;
  category: "accounting" | "cfo" | "tax";
  relatedSlugs: string[];
  updatedAt: string;
}

/** Item 4 order: the order every menu, footer list, dropdown, and card grid uses. */
export const services: Service[] = [
  // Accounting and Controller Services
  {
    slug: "fractional-controller-services",
    name: "Fractional Controller Services",
    shortDescription: "Controller oversight for accurate books, timely reporting, and strong internal controls, without the cost of a full-time hire.",
    consultationPhrase: "fractional controller",
    category: "accounting",
    relatedSlugs: ["bookkeeping-and-reconciliation", "accounting-system-setup", "audit-preparation"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "bookkeeping-and-reconciliation",
    name: "Bookkeeping and Reconciliation Services",
    shortDescription: "Monthly bookkeeping, bank and credit card reconciliations, general ledger management, and historical cleanup that keep your books accurate and current.",
    consultationPhrase: "bookkeeping and reconciliation",
    category: "accounting",
    relatedSlugs: ["fractional-controller-services", "payroll-and-hr-services", "accounting-system-setup"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "payroll-and-hr-services",
    name: "Payroll and HR Services",
    shortDescription: "Payroll setup and ongoing processing across one or multiple locations, with payroll reporting, labor cost tracking by location, and payroll entries recorded to your general ledger.",
    consultationPhrase: "payroll and HR",
    category: "accounting",
    relatedSlugs: ["bookkeeping-and-reconciliation", "merchant-processing", "accounting-system-setup"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "merchant-processing",
    name: "Merchant and Credit Card Processing",
    shortDescription: "Merchant and credit card processing provided directly through our ISO partnership, including high-risk industries such as cannabis, peptides, and iGaming, so your business can accept card payments reliably.",
    consultationPhrase: "merchant and credit card processing",
    category: "accounting",
    relatedSlugs: ["bookkeeping-and-reconciliation", "sales-tax-compliance", "accounting-system-setup"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "accounting-system-setup",
    name: "Accounting Software Setup and Migration",
    shortDescription: "Setup, migration, and automation for your accounting and reporting software, including QuickBooks, Xero, NetSuite, and Yardi, with chart of accounts design, job and cost codes, cost tracking by location or department, historical data imports, and multi-entity configuration.",
    consultationPhrase: "accounting software setup and migration",
    category: "accounting",
    relatedSlugs: ["bookkeeping-and-reconciliation", "fractional-controller-services", "startup-business-services"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "startup-business-services",
    name: "Startup Accounting and Finance",
    shortDescription: "Accounting and finance built right from day one. We handle state registration, business formation documents, entity structure, and accounting system setup, so your company starts with clean books and the right foundation.",
    consultationPhrase: "startup accounting and finance",
    category: "accounting",
    relatedSlugs: ["bookkeeping-and-reconciliation", "payroll-and-hr-services", "accounting-system-setup"],
    updatedAt: "2026-10-20",
  },

  // Fractional CFO Services
  {
    slug: "fractional-cfo-services",
    name: "Fractional CFO Services",
    shortDescription: "Part-time CFO leadership that gives you a strategic partner at the leadership table without a full-time hire. We lead cash flow forecasting, budgeting, scenario planning, profitability and pricing analysis, KPI and performance reporting, capital and financing strategy, entity structuring, and investor and lender reporting, so every major decision is backed by clear numbers and a plan.",
    consultationPhrase: "fractional CFO",
    category: "cfo",
    relatedSlugs: ["financial-planning-and-analysis", "financial-modeling", "fundraising-support"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "financial-planning-and-analysis",
    name: "Financial Planning and Analysis (FP&A)",
    shortDescription: "Annual budgets, rolling forecasts, and cash flow projections, with monthly budget-to-actual variance analysis tied to your KPIs and profitability, so you know where you stand against plan and can scale into new markets or products with confidence.",
    consultationPhrase: "financial planning and analysis",
    category: "cfo",
    relatedSlugs: ["financial-modeling", "fundraising-support", "bookkeeping-and-reconciliation"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "financial-modeling",
    name: "Financial Modeling and Analysis",
    shortDescription: "Custom financial models that show the impact of a decision before you make it. We analyze profitability, pricing, cost structure, and growth plans, with scenario and break-even analysis to guide your next move.",
    consultationPhrase: "financial modeling and analysis",
    category: "cfo",
    relatedSlugs: ["financial-planning-and-analysis", "fundraising-support", "mergers-acquisitions-advisory"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "fundraising-support",
    name: "Fundraising Support",
    shortDescription: "Investor-ready pitch decks, capital raise materials, and pro formas for both investor presentations and internal analysis. We prepare the numbers, the story, and the diligence package investors and lenders expect for equity or debt funding.",
    consultationPhrase: "fundraising support",
    category: "cfo",
    relatedSlugs: ["financial-modeling", "financial-planning-and-analysis", "mergers-acquisitions-advisory"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "mergers-acquisitions-advisory",
    name: "Mergers and Acquisitions Advisory",
    shortDescription: "Buy-side and sell-side M&A support, working alongside your investment bank, broker, or ownership team. We lead financial due diligence and build deal models with return and debt coverage analysis. For sellers, we normalize earnings, clean up the financials, and prepare the complete financial package buyers expect, then support the transition through close.",
    consultationPhrase: "mergers and acquisitions advisory",
    category: "cfo",
    relatedSlugs: ["financial-modeling", "financial-planning-and-analysis", "fundraising-support"],
    updatedAt: "2026-10-20",
  },

  // Tax Planning and Audit Readiness
  {
    slug: "tax-strategy-planning",
    name: "Business Tax Planning",
    shortDescription: "Year-round tax planning coordinated with your CPA or our tax partners. We keep your books tax-ready, track estimated tax payments, and model the tax impact of major decisions, such as entity elections, so there are no surprises at filing time.",
    consultationPhrase: "business tax planning",
    category: "tax",
    relatedSlugs: ["sales-tax-compliance", "audit-preparation", "financial-planning-and-analysis"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "sales-tax-compliance",
    name: "Sales Tax Compliance",
    shortDescription: "Sales and use tax compliance in every state, including sales reconciliation across all your sales channels, return preparation, and filing, so returns are accurate and filed on time.",
    consultationPhrase: "sales tax compliance",
    category: "tax",
    relatedSlugs: ["tax-strategy-planning", "accounting-system-setup", "bookkeeping-and-reconciliation"],
    updatedAt: "2026-10-20",
  },
  {
    slug: "audit-preparation",
    name: "Audit Preparation Services",
    shortDescription: "Audit readiness for financial statement, lender, and investor audits. We reconcile accounts, prepare schedules and supporting documentation, and coordinate with your auditors so fieldwork runs smoothly and on schedule.",
    consultationPhrase: "audit preparation",
    category: "tax",
    relatedSlugs: ["bookkeeping-and-reconciliation", "tax-strategy-planning", "fractional-controller-services"],
    updatedAt: "2026-10-20",
  },
];

export const serviceCategories = [
  { id: "accounting", name: "Accounting and Controller Services", description: "Clean books, reliable close, and controller oversight" },
  { id: "cfo", name: "Fractional CFO Services", description: "Planning, analysis, and strategic financial leadership" },
  { id: "tax", name: "Tax Planning and Audit Readiness", description: "Tax planning coordination and audit preparation" },
] as const;

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** A category's services in item 4 order. */
export function getServicesByCategory(category: Service["category"]): Service[] {
  return services.filter((s) => s.category === category);
}

const ANCHOR_SERVICE = "fractional-cfo-services";
/** The startup page's related links are spelled out in the content doc, without the CFO anchor. */
const NO_ANCHOR = new Set([ANCHOR_SERVICE, "startup-business-services"]);

/** Service pages link to Fractional CFO Services plus their curated related services (T13). */
export function getRelatedServices(currentSlug: string): Service[] {
  const current = getServiceBySlug(currentSlug);
  const slugs = [
    ...(NO_ANCHOR.has(currentSlug) ? [] : [ANCHOR_SERVICE]),
    ...(current?.relatedSlugs ?? []),
  ];
  return [...new Set(slugs)]
    .filter((slug) => slug !== currentSlug)
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is Service => Boolean(s));
}
