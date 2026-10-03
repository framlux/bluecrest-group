import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyTurnstile } from "./turnstile";

beforeEach(() => { process.env.TURNSTILE_SECRET = "secret"; });

describe("verifyTurnstile", () => {
  it("returns false without calling Cloudflare when the token is missing", async () => {
    const f = vi.fn();
    expect(await verifyTurnstile(undefined, undefined, f)).toBe(false);
    expect(await verifyTurnstile("", undefined, f)).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it("posts secret, token, and IP to siteverify", async () => {
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })));
    expect(await verifyTurnstile("tok", "1.2.3.4", f)).toBe(true);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    const body = init.body as URLSearchParams;
    expect(body.get("secret")).toBe("secret");
    expect(body.get("response")).toBe("tok");
    expect(body.get("remoteip")).toBe("1.2.3.4");
  });

  it("returns false on an expired token or a Cloudflare error", async () => {
    const expired = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, "error-codes": ["timeout-or-duplicate"] })));
    expect(await verifyTurnstile("tok", undefined, expired)).toBe(false);
    const down = vi.fn().mockResolvedValue(new Response("oops", { status: 503 }));
    expect(await verifyTurnstile("tok", undefined, down)).toBe(false);
  });

  it("throws when the secret is not configured", async () => {
    delete process.env.TURNSTILE_SECRET;
    await expect(verifyTurnstile("tok", undefined, vi.fn())).rejects.toThrow(/TURNSTILE_SECRET/);
  });
});
