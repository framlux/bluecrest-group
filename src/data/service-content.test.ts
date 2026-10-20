import { describe, it, expect } from "vitest";
import { serviceContent, getServiceContent } from "./service-content";
import { services, getServiceBySlug } from "./services";
import { testimonials } from "./testimonials";

const NO_PRICING = [
  "payroll-and-hr-services",
  "merchant-processing",
  "accounting-system-setup",
  "financial-modeling",
  "mergers-acquisitions-advisory",
];

describe("service page content (Developer Update List item 19)", () => {
  it("covers exactly the 14 services", () => {
    expect(Object.keys(serviceContent).sort()).toEqual(services.map((s) => s.slug).sort());
  });

  it.each(services.map((s) => [s.slug]))("%s follows the standard layout", (slug) => {
    const c = getServiceContent(slug)!;
    expect(c.intro).not.toContain("\n");
    expect(c.whatsIncluded.bullets.length).toBeGreaterThan(0);
    expect(c.process.steps).toHaveLength(4);
    expect(c.whyChoose.paragraphs).toHaveLength(2);
    expect(c.faq.items.length).toBeGreaterThan(0);
    expect(c.faq.items.length).toBeLessThanOrEqual(6);
    expect(c.faq.items.some((f) => /^How much (does|do)\b/.test(f.question))).toBe(true);
  });

  it.each(services.map((s) => [s.slug]))("%s has pricing only where the docs keep it", (slug) => {
    const pricing = getServiceContent(slug)!.pricing;
    if (NO_PRICING.includes(slug)) {
      expect(pricing).toBeUndefined();
    } else {
      expect(pricing?.factors).toHaveLength(4);
    }
  });

  it("keeps Who It's For cards only on Controller, CFO, and Sales Tax", () => {
    const withCards = Object.entries(serviceContent).filter(([, c]) => c.cards).map(([slug]) => slug).sort();
    expect(withCards).toEqual(["fractional-cfo-services", "fractional-controller-services", "sales-tax-compliance"]);
  });

  it("places each testimonial on its page", () => {
    const placed = Object.fromEntries(
      Object.entries(serviceContent).filter(([, c]) => c.whyChoose.testimonial).map(([slug, c]) => [slug, c.whyChoose.testimonial])
    );
    expect(placed).toEqual({
      "fractional-cfo-services": "tyson-johnson",
      "fractional-controller-services": "chris-gormley",
      "bookkeeping-and-reconciliation": "michael-royer",
      "accounting-system-setup": "lu-miller",
    });
    Object.values(placed).forEach((id) => expect(testimonials.some((t) => t.id === id)).toBe(true));
  });

  it("absorbs the merged pages as sections", () => {
    expect(getServiceContent("bookkeeping-and-reconciliation")!.extraSections!.map((s) => s.heading)).toEqual([
      "What You Receive Each Month",
      "Accounts Payable and Receivable Services",
    ]);
    expect(getServiceContent("financial-planning-and-analysis")!.extraSections!.map((s) => s.heading)).toEqual([
      "KPI Development and Dashboards",
    ]);
  });

  it("never mentions a removed page or the old category names", () => {
    const text = JSON.stringify(serviceContent);
    ["Service Area Coverage", "Business Consulting", "Tax and Audit Support", "Operational Efficiency", "Scaling and Growth", "$1M"].forEach(
      (phrase) => expect(text).not.toContain(phrase)
    );
  });

  it("every service has a name the content can be looked up by", () => {
    Object.keys(serviceContent).forEach((slug) => expect(getServiceBySlug(slug)).toBeDefined());
  });
});
