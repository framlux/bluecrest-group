import { describe, it, expect } from "vitest";
import { redirects } from "./redirects";
import { getServiceBySlug } from "./services";

describe("redirect map", () => {
  it("every entry is permanent and root-relative", () => {
    redirects.forEach((r) => {
      expect(r.permanent).toBe(true);
      expect(r.source.startsWith("/")).toBe(true);
      expect(r.destination.startsWith("/")).toBe(true);
    });
  });

  it("is one hop: no destination is also a source", () => {
    const sources = new Set(redirects.map((r) => r.source));
    redirects.forEach((r) => expect(sources.has(r.destination)).toBe(false));
  });

  it("sources are unique", () => {
    expect(new Set(redirects.map((r) => r.source)).size).toBe(redirects.length);
  });

  it("no redirected service still exists", () => {
    redirects
      .filter((r) => r.source.startsWith("/services/"))
      .forEach((r) => expect(getServiceBySlug(r.source.replace("/services/", ""))).toBeUndefined());
  });

  it("service destinations exist", () => {
    redirects
      .filter((r) => r.destination.startsWith("/services/"))
      .forEach((r) => expect(getServiceBySlug(r.destination.replace("/services/", ""))).toBeDefined());
  });
});
