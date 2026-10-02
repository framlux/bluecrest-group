import { describe, it, expect } from "vitest";
import { services, serviceMetaDescription, getRelatedServices, getServiceBySlug } from "./services";

describe("service meta descriptions", () => {
  const descs = services.map(serviceMetaDescription);

  it("are unique", () => {
    expect(new Set(descs).size).toBe(descs.length);
  });

  it.each(services.map((s) => [s.slug, serviceMetaDescription(s)]))(
    "%s has no doubled word and no lowercase acronym",
    (_slug, d) => {
      expect(d).not.toMatch(/\b(\w+)\s+\1\b/i);
      expect(d).not.toMatch(/\bkpi\b/);
      expect(d).not.toMatch(/\bcfo\b/);
    }
  );
});

const CFO = "fractional-cfo-services";

describe("service catalogue", () => {
  it("has 16 services and none of the folded ones", () => {
    expect(services).toHaveLength(16);
    expect(getServiceBySlug("payroll-processing")).toBeUndefined();
    expect(getServiceBySlug("kpi-dashboards-reporting")).toBeUndefined();
  });

  it.each(services.map((s) => [s.slug, s]))("%s relatedSlugs are valid", (_slug, s) => {
    expect(s.relatedSlugs.length).toBeGreaterThanOrEqual(2);
    expect(s.relatedSlugs.length).toBeLessThanOrEqual(3);
    s.relatedSlugs.forEach((r) => {
      expect(getServiceBySlug(r)).toBeDefined();
      expect(r).not.toBe(s.slug);
    });
  });

  it.each(services.map((s) => [s.slug]))("%s related services lead with Fractional CFO", (slug) => {
    const related = getRelatedServices(slug).map((s) => s.slug);
    if (slug !== CFO) expect(related[0]).toBe(CFO);
    expect(related).not.toContain(slug);
    expect(new Set(related).size).toBe(related.length);
    expect(related.length).toBeGreaterThanOrEqual(2);
    expect(related.length).toBeLessThanOrEqual(4);
  });

  it.each(services.map((s) => [s.slug, s.updatedAt]))("%s updatedAt is a date", (_s, d) => {
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
