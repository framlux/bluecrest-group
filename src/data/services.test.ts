import { describe, it, expect } from "vitest";
import { services, serviceMetaDescription } from "./services";

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
