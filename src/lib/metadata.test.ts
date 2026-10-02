import { describe, it, expect } from "vitest";
import { buildMetadata, fullTitle, DEFAULT_OG_IMAGE } from "./metadata";

describe("buildMetadata", () => {
  const base = { title: "Contact Us", description: "Reach the team.", path: "/contact" };

  it("sets canonical and og:url to the same path", () => {
    const m = buildMetadata(base);
    expect(m.alternates?.canonical).toBe("/contact");
    expect((m.openGraph as { url?: string }).url).toBe("/contact");
  });

  it("strips trailing slashes except on the root", () => {
    expect(buildMetadata({ ...base, path: "/about/" }).alternates?.canonical).toBe("/about");
    expect(buildMetadata({ ...base, path: "/" }).alternates?.canonical).toBe("/");
  });

  it("rejects relative or absolute-URL paths", () => {
    expect(() => buildMetadata({ ...base, path: "contact" })).toThrow();
    expect(() => buildMetadata({ ...base, path: "https://bluecrest-group.com/x" })).toThrow();
  });

  it("puts the brand exactly once in social titles", () => {
    const m = buildMetadata(base);
    expect(m.title).toBe("Contact Us");
    expect((m.openGraph as { title?: string }).title).toBe("Contact Us | BlueCrest Group");
    expect((m.twitter as { title?: string }).title).toBe("Contact Us | BlueCrest Group");
  });

  it("supports absolute titles for the homepage", () => {
    const m = buildMetadata({ ...base, title: "BlueCrest Group | Fractional CFO", absoluteTitle: true, path: "/" });
    expect(m.title).toEqual({ absolute: "BlueCrest Group | Fractional CFO" });
    expect((m.openGraph as { title?: string }).title).toBe("BlueCrest Group | Fractional CFO");
  });

  it("uses page description for og and twitter", () => {
    const m = buildMetadata(base);
    expect((m.openGraph as { description?: string }).description).toBe("Reach the team.");
    expect((m.twitter as { description?: string }).description).toBe("Reach the team.");
  });

  it("falls back to the default OG image and keeps siteName/type/locale", () => {
    const og = buildMetadata(base).openGraph as Record<string, unknown>;
    expect(og.images).toEqual([DEFAULT_OG_IMAGE]);
    expect(og.siteName).toBe("BlueCrest Group");
    expect(og.locale).toBe("en_US");
    expect(og.type).toBe("website");
  });

  it("uses a per-page image when given", () => {
    const img = { url: "https://cdn.sanity.io/x.jpg", width: 1200, height: 630, alt: "x" };
    const m = buildMetadata({ ...base, image: img });
    expect((m.openGraph as { images?: unknown }).images).toEqual([img]);
    expect((m.twitter as { images?: unknown }).images).toEqual([img.url]);
  });

  it("sets noindex, follow only when asked", () => {
    expect(buildMetadata(base).robots).toBeUndefined();
    expect(buildMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: true });
  });
});

describe("fullTitle", () => {
  it("appends the brand unless absolute", () => {
    expect(fullTitle("Insights")).toBe("Insights | BlueCrest Group");
    expect(fullTitle("BlueCrest Group | Home", true)).toBe("BlueCrest Group | Home");
  });
});
