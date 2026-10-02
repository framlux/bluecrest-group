import { describe, it, expect } from "vitest";
import { redirects } from "./redirects";
import { getServiceBySlug } from "./services";
import { locations, getLocationBySlug } from "./locations";

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

describe("city redirects", () => {
  const removed = [
    "irvine-ca", "costa-mesa-ca", "huntington-beach-ca", "laguna-beach-ca", "orange-ca",
    "santa-ana-ca", "anaheim-ca", "fullerton-ca", "tustin-ca", "mission-viejo-ca", "lake-forest-ca",
  ];

  it("only Newport Beach remains", () => {
    expect(locations.map((l) => l.slug)).toEqual(["newport-beach-ca"]);
  });

  it.each(removed)("%s redirects to the hub", (slug) => {
    const r = redirects.find((x) => x.source === `/service-areas/${slug}`);
    expect(r?.destination).toBe("/service-areas");
  });

  it("Corona del Mar redirects to Newport Beach", () => {
    const r = redirects.find((x) => x.source === "/service-areas/corona-del-mar-ca");
    expect(r?.destination).toBe("/service-areas/newport-beach-ca");
  });

  it("no redirected city still exists", () => {
    redirects
      .filter((r) => r.source.startsWith("/service-areas/"))
      .forEach((r) => expect(getLocationBySlug(r.source.replace("/service-areas/", ""))).toBeUndefined());
  });
});
