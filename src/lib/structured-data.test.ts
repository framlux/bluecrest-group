import { describe, it, expect } from "vitest";
import {
  businessSchema, personSchema, serviceSchema, faqSchema, breadcrumbSchema,
  articleSchema, serializeJsonLd, BUSINESS_ID, FOUNDER_ID, absoluteUrl,
} from "./structured-data";

const ORIGIN = "https://bluecrest-group.com";

describe("businessSchema", () => {
  const s = businessSchema();

  it("is one ProfessionalService entity on the non-www origin", () => {
    expect(s["@type"]).toBe("ProfessionalService");
    expect(s["@id"]).toBe(BUSINESS_ID);
    expect(s.url).toBe(ORIGIN);
    expect(s.logo).toBe(`${ORIGIN}/images/bluecrest-group-logo.png`);
  });

  it("has no street address or geo coordinates", () => {
    const json = JSON.stringify(s);
    expect(json).not.toContain("streetAddress");
    expect(json).not.toContain("GeoCoordinates");
    expect(json).not.toContain("GeoCircle");
    expect(s.address).toEqual({ "@type": "PostalAddress", addressLocality: "Newport Beach", addressRegion: "CA", addressCountry: "US" });
  });

  it("lists Orange County and every service-area city", () => {
    const areas = s.areaServed as { "@type": string; name: string }[];
    expect(areas[0]).toEqual({ "@type": "AdministrativeArea", name: "Orange County, CA" });
    expect(areas.some((a) => a.name === "Newport Beach, CA" && a["@type"] === "City")).toBe(true);
  });

  it("omits telephone and sameAs while they are empty", () => {
    expect(s).not.toHaveProperty("telephone");
    expect(s).not.toHaveProperty("sameAs");
  });

  it("links the founder by @id", () => {
    expect(s.founder).toEqual({ "@type": "Person", "@id": FOUNDER_ID, name: "Josh Miller", url: `${ORIGIN}/about` });
  });
});

describe("page schemas", () => {
  it("person works for the business", () => {
    const p = personSchema();
    expect(p["@id"]).toBe(FOUNDER_ID);
    expect(p.worksFor).toEqual({ "@id": BUSINESS_ID });
  });

  it("service references the provider by @id with an absolute url", () => {
    const s = serviceSchema({ name: "Audit Preparation", description: "d", path: "/services/audit-preparation" });
    expect(s.provider).toEqual({ "@id": BUSINESS_ID });
    expect(s.url).toBe(`${ORIGIN}/services/audit-preparation`);
  });

  it("FAQPage mirrors the given FAQ text exactly", () => {
    const faqs = [{ question: "Q1?", answer: "A1." }, { question: "Q2?", answer: "A2." }];
    const f = faqSchema(faqs) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(f.mainEntity.map((q) => [q.name, q.acceptedAnswer.text])).toEqual([["Q1?", "A1."], ["Q2?", "A2."]]);
  });

  it("breadcrumbs are positioned and absolute", () => {
    const b = breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]) as {
      itemListElement: { position: number; item: string }[];
    };
    expect(b.itemListElement).toEqual([
      expect.objectContaining({ position: 1, item: `${ORIGIN}/` }),
      expect.objectContaining({ position: 2, item: `${ORIGIN}/services` }),
    ]);
  });

  it("article has author, publisher, and dates", () => {
    const a = articleSchema({ headline: "H", description: "D", path: "/insights/h", datePublished: "2026-10-01" });
    expect(a.author).toEqual({ "@type": "Person", "@id": FOUNDER_ID, name: "Josh Miller", url: `${ORIGIN}/about` });
    expect(a.publisher).toEqual({ "@id": BUSINESS_ID });
    expect(a.dateModified).toBe("2026-10-01");
    expect(a.mainEntityOfPage).toBe(`${ORIGIN}/insights/h`);
  });

  it("absoluteUrl leaves absolute urls alone", () => {
    expect(absoluteUrl("https://cdn.sanity.io/a.jpg")).toBe("https://cdn.sanity.io/a.jpg");
  });
});

describe("serializeJsonLd", () => {
  it("cannot close the script tag", () => {
    const out = serializeJsonLd({ text: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).text).toBe("</script><script>alert(1)</script>");
  });
});
