export interface Service {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  metaDescription?: string;
  category: "accounting" | "cfo" | "tax" | "consulting";
  priority: number;
  relatedSlugs: string[];
  updatedAt: string;
}

export const services: Service[] = [
  // Core Accounting & Controller Services
  {
    id: 1,
    slug: "fractional-controller-services",
    name: "Fractional Controller Services",
    shortDescription: "Expert controller oversight for clean books, accurate reporting, and team guidance without the full time cost.",
    category: "accounting",
    priority: 1,
    relatedSlugs: ["month-end-close-financial-statements", "bookkeeping-and-reconciliation", "accounting-system-setup"],
    updatedAt: "2026-10-02",
  },
  {
    id: 2,
    slug: "bookkeeping-and-reconciliation",
    name: "Bookkeeping and Reconciliation",
    shortDescription: "Accurate bookkeeping, reconciliations, and general ledger management to keep your finances organized.",
    category: "accounting",
    priority: 2,
    relatedSlugs: ["month-end-close-financial-statements", "accounts-payable-receivable", "fractional-controller-services"],
    updatedAt: "2026-10-02",
  },
  {
    id: 3,
    slug: "month-end-close-financial-statements",
    name: "Month End Close and Financial Statements",
    shortDescription: "Full month end close processes and GAAP compliant financial statements delivered on time.",
    category: "accounting",
    priority: 3,
    relatedSlugs: ["bookkeeping-and-reconciliation", "fractional-controller-services", "audit-preparation"],
    updatedAt: "2026-10-02",
  },
  {
    id: 4,
    slug: "accounts-payable-receivable",
    name: "Accounts Payable and Receivable",
    shortDescription: "Streamlined AP and AR management with cash flow optimization to improve working capital.",
    category: "accounting",
    priority: 4,
    relatedSlugs: ["bookkeeping-and-reconciliation", "budgeting-and-forecasting", "accounting-system-setup"],
    updatedAt: "2026-10-02",
  },
  {
    id: 6,
    slug: "accounting-system-setup",
    name: "Accounting System Setup and Migration",
    shortDescription: "Setup, migration, and automation for QuickBooks, Xero, NetSuite, and other accounting platforms.",
    category: "accounting",
    priority: 6,
    relatedSlugs: ["bookkeeping-and-reconciliation", "fractional-controller-services", "operational-efficiency-consulting"],
    updatedAt: "2026-10-02",
  },

  // Strategic Fractional CFO Services
  {
    id: 7,
    slug: "fractional-cfo-services",
    name: "Fractional CFO Services",
    shortDescription: "Strategic financial leadership and executive advisory tailored to your business growth stage.",
    category: "cfo",
    priority: 1,
    relatedSlugs: ["budgeting-and-forecasting", "financial-modeling", "fundraising-support"],
    updatedAt: "2026-10-02",
  },
  {
    id: 8,
    slug: "budgeting-and-forecasting",
    name: "Budgeting and Forecasting",
    shortDescription: "Comprehensive budgeting, forecasting, and rolling cash flow projections for informed planning.",
    category: "cfo",
    priority: 2,
    relatedSlugs: ["financial-modeling", "scaling-growth-support", "month-end-close-financial-statements"],
    updatedAt: "2026-10-02",
  },
  {
    id: 9,
    slug: "financial-modeling",
    name: "Financial Modeling and Analysis",
    shortDescription: "Detailed financial modeling, scenario analysis, and profitability insights to drive decisions.",
    category: "cfo",
    priority: 3,
    relatedSlugs: ["budgeting-and-forecasting", "fundraising-support", "mergers-acquisitions-advisory"],
    updatedAt: "2026-10-02",
  },
  {
    id: 11,
    slug: "fundraising-support",
    name: "Fundraising Support",
    shortDescription: "Pitch deck development, investor materials, and capital raise support for growth funding.",
    category: "cfo",
    priority: 5,
    relatedSlugs: ["financial-modeling", "startup-business-services", "mergers-acquisitions-advisory"],
    updatedAt: "2026-10-02",
  },
  {
    id: 12,
    slug: "mergers-acquisitions-advisory",
    name: "Mergers and Acquisitions Advisory",
    shortDescription: "M and A due diligence, exit planning, and transaction advisory for strategic moves.",
    category: "cfo",
    priority: 6,
    relatedSlugs: ["financial-modeling", "audit-preparation", "fundraising-support"],
    updatedAt: "2026-10-02",
  },

  // Tax & Audit Support
  {
    id: 13,
    slug: "tax-strategy-planning",
    name: "Tax Strategy and Planning",
    shortDescription: "Proactive tax strategy, planning, and optimization coordination to minimize liability.",
    category: "tax",
    priority: 1,
    relatedSlugs: ["sales-tax-compliance", "audit-preparation", "budgeting-and-forecasting"],
    updatedAt: "2026-10-02",
  },
  {
    id: 14,
    slug: "sales-tax-compliance",
    name: "Sales Tax Compliance",
    shortDescription: "Sales and use tax compliance and multi state filings to keep you compliant everywhere.",
    category: "tax",
    priority: 2,
    relatedSlugs: ["tax-strategy-planning", "accounting-system-setup", "bookkeeping-and-reconciliation"],
    updatedAt: "2026-10-02",
  },
  {
    id: 15,
    slug: "audit-preparation",
    name: "Audit Preparation and Coordination",
    shortDescription: "Audit readiness, preparation, and coordination to ensure smooth audit processes.",
    category: "tax",
    priority: 3,
    relatedSlugs: ["month-end-close-financial-statements", "tax-strategy-planning", "fractional-controller-services"],
    updatedAt: "2026-10-02",
  },

  // Business Consulting & Partnerships
  {
    id: 16,
    slug: "startup-business-services",
    name: "Startup and Small Business Services",
    shortDescription: "Specialized financial support for startups and small businesses ready to scale.",
    category: "consulting",
    priority: 1,
    relatedSlugs: ["bookkeeping-and-reconciliation", "fundraising-support", "scaling-growth-support"],
    updatedAt: "2026-10-02",
  },
  {
    id: 17,
    slug: "operational-efficiency-consulting",
    name: "Operational Efficiency Consulting",
    shortDescription: "Process improvement consulting to streamline operations and reduce costs.",
    category: "consulting",
    priority: 2,
    relatedSlugs: ["scaling-growth-support", "accounting-system-setup", "fractional-controller-services"],
    updatedAt: "2026-10-02",
  },
  {
    id: 18,
    slug: "scaling-growth-support",
    name: "Scaling and Growth Support",
    shortDescription: "Systems, hiring, and growth infrastructure support for businesses ready to expand.",
    category: "consulting",
    priority: 3,
    relatedSlugs: ["operational-efficiency-consulting", "budgeting-and-forecasting", "startup-business-services"],
    updatedAt: "2026-10-02",
  },
];

export const serviceCategories = [
  { id: "accounting", name: "Accounting and Controller Services", description: "Core accounting operations and controller oversight" },
  { id: "cfo", name: "Fractional CFO Services", description: "Strategic financial leadership and advisory" },
  { id: "tax", name: "Tax and Audit Support", description: "Tax planning, compliance, and audit coordination" },
  { id: "consulting", name: "Business Consulting", description: "Operational consulting and growth support" },
] as const;

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: Service["category"]): Service[] {
  return services.filter((s) => s.category === category).sort((a, b) => a.priority - b.priority);
}

const ANCHOR_SERVICE = "fractional-cfo-services";

/** Every service page links to Fractional CFO Services plus its curated related services (T13). */
export function getRelatedServices(currentSlug: string): Service[] {
  const current = getServiceBySlug(currentSlug);
  const slugs = [
    ...(currentSlug === ANCHOR_SERVICE ? [] : [ANCHOR_SERVICE]),
    ...(current?.relatedSlugs ?? []),
  ];
  return [...new Set(slugs)]
    .filter((slug) => slug !== currentSlug)
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is Service => Boolean(s));
}

/** Per-page meta description: the supplied override, else the short description alone (T7). */
export function serviceMetaDescription(service: Service): string {
  return service.metaDescription ?? service.shortDescription;
}
