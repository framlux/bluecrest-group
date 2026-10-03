import { describe, it, expect } from "vitest";
import { articleMetadataInput, shouldIndexInsights } from "./insights";
import { relatedServiceOptions } from "../../sanity/schemaTypes/service-options";
import { services } from "@/data/services";

const base = { title: "Cash Flow Basics", slug: "cash-flow-basics", publishedAt: "2026-10-01T00:00:00Z" };

describe("articleMetadataInput", () => {
  it("prefers seoDescription, then excerpt, then a default", () => {
    expect(articleMetadataInput({ ...base, seoDescription: "S", excerpt: "E" }, true).description).toBe("S");
    expect(articleMetadataInput({ ...base, excerpt: "E" }, true).description).toBe("E");
    expect(articleMetadataInput(base, true).description.length).toBeGreaterThan(20);
  });

  it("uses the article path and type", () => {
    const m = articleMetadataInput(base, true);
    expect(m.path).toBe("/insights/cash-flow-basics");
    expect(m.type).toBe("article");
  });

  it("falls back to the site image when there is no og image", () => {
    expect(articleMetadataInput(base, true).image).toBeUndefined();
    expect(articleMetadataInput({ ...base, ogImageUrl: "https://cdn.sanity.io/x.jpg" }, true).image?.url).toBe("https://cdn.sanity.io/x.jpg");
  });

  it("noindexes articles while Insights is switched off", () => {
    expect(articleMetadataInput(base, false).noindex).toBe(true);
    expect(articleMetadataInput(base, true).noindex).toBe(false);
  });
});

describe("shouldIndexInsights", () => {
  it("needs the switch on and at least one article", () => {
    expect(shouldIndexInsights(3, false)).toBe(false);
    expect(shouldIndexInsights(0, true)).toBe(false);
    expect(shouldIndexInsights(1, true)).toBe(true);
  });
});

describe("Studio related-service options", () => {
  it("match the live service catalogue", () => {
    expect(relatedServiceOptions.map((o) => o.value).sort()).toEqual(services.map((s) => s.slug).sort());
  });
});
