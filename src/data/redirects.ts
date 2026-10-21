/** Permanent (308) redirects for removed pages. One hop each; see the spec's Redirect Map. */
export interface Redirect {
  source: string;
  destination: string;
  permanent: true;
}

export const redirects: Redirect[] = [
  // Developer Update List item 4a: renamed, merged, and removed service pages.
  ...Object.entries({
    "budgeting-and-forecasting": "financial-planning-and-analysis",
    "kpi-dashboards-reporting": "financial-planning-and-analysis",
    "payroll-processing": "payroll-and-hr-services",
    "scaling-growth-support": "fractional-cfo-services",
    "month-end-close-financial-statements": "bookkeeping-and-reconciliation",
    "accounts-payable-receivable": "bookkeeping-and-reconciliation",
    "operational-efficiency-consulting": "accounting-system-setup",
  }).map(([from, to]): Redirect => ({ source: `/services/${from}`, destination: `/services/${to}`, permanent: true })),
  ...[
    "irvine-ca", "costa-mesa-ca", "huntington-beach-ca", "laguna-beach-ca", "orange-ca",
    "santa-ana-ca", "anaheim-ca", "fullerton-ca", "tustin-ca", "mission-viejo-ca", "lake-forest-ca",
    "corona-del-mar-ca",
  ].map((slug): Redirect => ({ source: `/service-areas/${slug}`, destination: "/service-areas", permanent: true })),
  { source: "/insights", destination: "/", permanent: true },
  { source: "/insights/:path*", destination: "/", permanent: true },
];
