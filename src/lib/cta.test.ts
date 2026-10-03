import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { contactCtaHref, CONTACT_CTA_LABEL } from "./cta";

describe("contactCtaHref", () => {
  it("scrolls in place on the contact page", () => {
    expect(contactCtaHref("/contact")).toBe("#contact-form");
  });
  it("goes to the form from anywhere else", () => {
    expect(contactCtaHref("/")).toBe("/contact#contact-form");
    expect(contactCtaHref(null)).toBe("/contact#contact-form");
  });
  it("label is Contact Us", () => {
    expect(CONTACT_CTA_LABEL).toBe("Contact Us");
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("no legacy CTA labels in public UI", () => {
  const banned = /Connect Today|Book a call|Book An Intro|Book a 15|Free Consultation|Schedule a Consultation/i;
  const files = [...walk("src/components"), ...walk("src/app/(public)")]
    .filter((f) => f.endsWith(".tsx") && !f.includes("/portal/"));

  it.each(files)("%s", (f) => {
    expect(readFileSync(f, "utf8")).not.toMatch(banned);
  });
});
