/** Permanent (308) redirects for removed pages. One hop each; see the spec's Redirect Map. */
export interface Redirect {
  source: string;
  destination: string;
  permanent: true;
}

export const redirects: Redirect[] = [
  { source: "/services/payroll-processing", destination: "/services/bookkeeping-and-reconciliation", permanent: true },
  { source: "/services/kpi-dashboards-reporting", destination: "/services/fractional-cfo-services", permanent: true },
  ...[
    "irvine-ca", "costa-mesa-ca", "huntington-beach-ca", "laguna-beach-ca", "orange-ca",
    "santa-ana-ca", "anaheim-ca", "fullerton-ca", "tustin-ca", "mission-viejo-ca", "lake-forest-ca",
  ].map((slug): Redirect => ({ source: `/service-areas/${slug}`, destination: "/service-areas", permanent: true })),
  { source: "/service-areas/corona-del-mar-ca", destination: "/service-areas/newport-beach-ca", permanent: true },
  { source: "/insights", destination: "/", permanent: true },
  { source: "/insights/:path*", destination: "/", permanent: true },
];
