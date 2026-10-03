import { describe, it, expect } from "vitest";
import { buildSitemapEntries } from "./sitemap-entries";
import { redirects } from "@/data/redirects";

const ORIGIN = "https://bluecrest-group.com";
const articles = [
  { slug: "a", publishedAt: "2026-09-01T00:00:00Z" },
  { slug: "b", publishedAt: "2026-09-02T00:00:00Z", updatedAt: "2026-09-20T00:00:00Z" },
];

describe("buildSitemapEntries", () => {
  const off = buildSitemapEntries(articles, { insightsEnabled: false });
  const urls = off.map((e) => e.url);

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

  it("leaves Insights and articles out while switched off", () => {
    expect(urls.some((u) => u.includes("/insights"))).toBe(false);
  });

  it("has no duplicate URLs and a real lastModified on each", () => {
    expect(new Set(urls).size).toBe(urls.length);
    off.forEach((e) => expect(String(e.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}/));
  });

  it("adds Insights and articles when switched on, dated by update then publish", () => {
    const on = buildSitemapEntries(articles, { insightsEnabled: true });
    const byUrl = Object.fromEntries(on.map((e) => [e.url, e.lastModified]));
    expect(byUrl).toHaveProperty(`${ORIGIN}/insights`);
    expect(byUrl[`${ORIGIN}/insights/a`]).toBe("2026-09-01T00:00:00Z");
    expect(byUrl[`${ORIGIN}/insights/b`]).toBe("2026-09-20T00:00:00Z");
  });
});
