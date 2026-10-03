import { createHmac } from "node:crypto";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Unlike route.test.ts, parseBody is NOT mocked here: these tests exercise the real
// next-sanity signature check. Only the cache call is mocked.
const revalidateTag = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidateTag }));

import { POST } from "./route";

const SECRET = "s3cret";

function sign(body: string, secret = SECRET): string {
  const ts = Date.now();
  const sig = createHmac("sha256", secret).update(`${ts}.${body}`).digest("base64url");
  return `t=${ts},v1=${sig}`;
}

function req(body: string, signature?: string) {
  const headers: Record<string, string> = {};
  if (signature !== undefined) headers["sanity-webhook-signature"] = signature;
  return new NextRequest("http://localhost/api/revalidate", { method: "POST", headers, body });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  process.env.SANITY_REVALIDATE_SECRET = SECRET;
  delete process.env.REVALIDATE_PEERS_HOST;
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("POST /api/revalidate with the real signature check", () => {
  it("rejects a bad signature with a JSON body", async () => {
    const res = await POST(req('{"_type":"article"}', "t=1700000000000,v1=abc"));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a bad signature with a non-JSON body (401, not 500)", async () => {
    const res = await POST(req("not json", "t=1700000000000,v1=abc"));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a malformed signature header with an HTML body (401, not 500)", async () => {
    const res = await POST(req("<html>", "x"));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a request with no signature header", async () => {
    const res = await POST(req('{"_type":"article"}'));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a signature that was computed over a different body", async () => {
    const res = await POST(req('{"_type":"tampered"}', sign('{"_type":"article"}')));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a signature made with the wrong secret", async () => {
    const body = '{"_type":"article"}';
    const res = await POST(req(body, sign(body, "other-secret")));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("accepts a correctly signed request and revalidates", async () => {
    // A valid signature makes parseBody wait 3s for Content Lake consistency; fake only
    // setTimeout so the wait is skipped while the real HMAC check still runs.
    vi.useFakeTimers({ toFake: ["setTimeout"] });
    const body = '{"_type":"article"}';
    const pending = POST(req(body, sign(body)));
    while (vi.getTimerCount() === 0) await new Promise((r) => setImmediate(r));
    await vi.advanceTimersByTimeAsync(3000);
    const res = await pending;
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("sanity");
  });
});
