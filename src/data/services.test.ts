import { describe, it, expect } from "vitest";
import { services, serviceCategories, getRelatedServices, getServiceBySlug, getServicesByCategory } from "./services";

const CFO = "fractional-cfo-services";

describe("service catalogue (Developer Update List item 4)", () => {
  it("has the 14 services in item 4 order", () => {
    expect(services.map((s) => s.name)).toEqual([
      "Fractional Controller Services",
      "Bookkeeping and Reconciliation Services",
      "Payroll and HR Services",
      "Merchant and Credit Card Processing",
      "Accounting Software Setup and Migration",
      "Startup Accounting and Finance",
      "Fractional CFO Services",
      "Financial Planning and Analysis (FP&A)",
      "Financial Modeling and Analysis",
      "Fundraising Support",
      "Mergers and Acquisitions Advisory",
      "Business Tax Planning",
      "Sales Tax Compliance",
      "Audit Preparation Services",
    ]);
  });

  it("has exactly three categories, without Business Consulting", () => {
    expect(serviceCategories.map((c) => c.name)).toEqual([
      "Accounting and Controller Services",
      "Fractional CFO Services",
      "Tax Planning and Audit Readiness",
    ]);
    expect(getServicesByCategory("accounting").at(-1)?.slug).toBe("startup-business-services");
  });

  it("uses the item 4a-4c URLs", () => {
    ["payroll-and-hr-services", "merchant-processing", "financial-planning-and-analysis"].forEach((slug) =>
      expect(getServiceBySlug(slug)).toBeDefined()
    );
    [
      "payroll-processing", "kpi-dashboards-reporting", "budgeting-and-forecasting", "scaling-growth-support",
      "month-end-close-financial-statements", "accounts-payable-receivable", "operational-efficiency-consulting",
    ].forEach((slug) => expect(getServiceBySlug(slug)).toBeUndefined());
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
    if (slug !== CFO && slug !== "startup-business-services") expect(related[0]).toBe(CFO);
    if (slug === "startup-business-services") expect(related).not.toContain(CFO);
    expect(related).not.toContain(slug);
    expect(new Set(related).size).toBe(related.length);
    expect(related.length).toBeGreaterThanOrEqual(2);
    expect(related.length).toBeLessThanOrEqual(4);
  });

  it.each(services.map((s) => [s.slug, s.consultationPhrase]))("%s consultation phrase keeps acronyms uppercase", (_s, p) => {
    expect(p).not.toMatch(/\b(cfo|hr|fp&a|kpi)\b/);
  });

  it.each(services.map((s) => [s.slug, s.updatedAt]))("%s updatedAt is a date", (_s, d) => {
    expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
