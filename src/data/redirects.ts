/** Permanent (308) redirects for removed pages. One hop each; see the spec's Redirect Map. */
export interface Redirect {
  source: string;
  destination: string;
  permanent: true;
}

export const redirects: Redirect[] = [
  { source: "/services/payroll-processing", destination: "/services/bookkeeping-and-reconciliation", permanent: true },
  { source: "/services/kpi-dashboards-reporting", destination: "/services/fractional-cfo-services", permanent: true },
];
