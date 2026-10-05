import { describe, it, expect } from "vitest";
import { buildSitemapEntries } from "./sitemap-entries";
import { redirects } from "@/data/redirects";

const ORIGIN = "https://bluecrest-group.com";
describe("buildSitemapEntries", () => {
  const entries = buildSitemapEntries();
  const urls = entries.map((e) => e.url);

  it("uses only the non-www origin", () => {
    urls.forEach((u) => expect(u.startsWith(`${ORIGIN}/`) || u === ORIGIN).toBe(true));
    expect(urls.join()).not.toContain("www.");
  });

  it("includes privacy, terms, 16 services, and Newport Beach", () => {
    expect(urls).toContain(`${ORIGIN}/privacy`);
    expect(urls).toContain(`${ORIGIN}/terms`);
    expect(urls.filter((u) => u.startsWith(`${ORIGIN}/services/`))).toHaveLength(16);
    expect(urls).toContain(`${ORIGIN}/service-areas/newport-beach-ca`);
  });

  it("never lists a redirected URL", () => {
    redirects.forEach((r) => expect(urls).not.toContain(`${ORIGIN}${r.source}`));
  });

  it("has no Insights URLs", () => {
    expect(urls.some((u) => u.includes("/insights"))).toBe(false);
  });

  it("has no duplicate URLs and a real lastModified on each", () => {
    expect(new Set(urls).size).toBe(urls.length);
    entries.forEach((e) => expect(String(e.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}/));
  });
});
