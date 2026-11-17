import { describe, it, expect, afterEach } from "vitest";
import { GET } from "./route";

afterEach(() => { delete process.env.TURNSTILE_SITE_KEY; });

describe("GET /api/turnstile-config", () => {
  it("returns the site key from the runtime env", async () => {
    process.env.TURNSTILE_SITE_KEY = "site-key";
    const res = GET();
    expect(await res.json()).toEqual({ siteKey: "site-key" });
    expect(res.headers.get("Cache-Control")).toBe("public, max-age=300");
  });

  it("returns an empty key when it is not configured", async () => {
    expect(await GET().json()).toEqual({ siteKey: "" });
  });
});
