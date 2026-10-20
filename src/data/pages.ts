/** Static, indexable public pages. Bump updatedAt when a page's content changes (T3). */
export interface StaticPage {
  path: string;
  updatedAt: string;
}

export const staticPages: StaticPage[] = [
  { path: "/", updatedAt: "2026-10-20" },
  { path: "/about", updatedAt: "2026-10-20" },
  { path: "/contact", updatedAt: "2026-10-20" },
  { path: "/services", updatedAt: "2026-10-20" },
  { path: "/service-areas", updatedAt: "2026-10-20" },
  { path: "/service-areas/newport-beach-ca", updatedAt: "2026-10-20" },
  { path: "/privacy", updatedAt: "2026-10-20" },
  { path: "/terms", updatedAt: "2026-10-02" },
];
