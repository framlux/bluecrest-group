import { describe, it, expect } from "vitest";
import { caseStudies } from "./case-studies";
import { getServiceBySlug } from "./services";

describe("case studies", () => {
  it("has the three supplied URLs", () => {
    expect(caseStudies.map((c) => c.slug)).toEqual([
      "yardi-implementation-industrial-real-estate",
      "multi-location-restaurant-accounting",
      "ecommerce-inventory-profitability-tracking",
    ]);
  });

  it.each(caseStudies.map((c) => [c.slug, c]))("%s is complete and well-formed", (_slug, c) => {
    expect(c.title.endsWith(" | BlueCrest Group")).toBe(true);
    expect(c.title.match(/BlueCrest Group/g)).toHaveLength(1);
    expect(c.h1.startsWith("Case Study: ")).toBe(true);
    expect(c.card.heading).toBe(c.h1.replace("Case Study: ", ""));
    expect(c.relatedSlugs).toHaveLength(3);
    c.relatedSlugs.forEach((slug) => expect(getServiceBySlug(slug)).toBeDefined());
    expect(c.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("descriptions are unique", () => {
    expect(new Set(caseStudies.map((c) => c.description)).size).toBe(caseStudies.length);
  });
});
