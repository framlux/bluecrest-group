import { describe, it, expect, vi, beforeEach } from "vitest";

const revalidateTag = vi.hoisted(() => vi.fn());
const parseBody = vi.hoisted(() => vi.fn());
const fanOut = vi.hoisted(() => vi.fn());

vi.mock("next/cache", () => ({ revalidateTag }));
vi.mock("next-sanity/webhook", () => ({ parseBody }));
vi.mock("@/lib/revalidate", async (orig) => ({
  ...(await orig<typeof import("@/lib/revalidate")>()),
  fanOutRevalidate: fanOut,
}));

import { POST } from "./route";

function req(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/revalidate", { method: "POST", headers, body: "{}" }) as never;
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.SANITY_REVALIDATE_SECRET = "s3cret";
  process.env.REVALIDATE_PEERS_HOST = "peers.local";
  fanOut.mockResolvedValue([{ ip: "10.0.0.2", ok: false }]);
});

describe("POST /api/revalidate", () => {
  it("rejects an invalid signature without revalidating", async () => {
    parseBody.mockResolvedValue({ isValidSignature: false, body: null });
    const res = await POST(req());
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(fanOut).not.toHaveBeenCalled();
  });

  it("rejects a missing signature (null) the same way", async () => {
    parseBody.mockResolvedValue({ isValidSignature: null, body: null });
    expect((await POST(req())).status).toBe(401);
  });

  it("revalidates and fans out on a valid signature, even if a peer fails", async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: "article" } });
    const res = await POST(req());
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("sanity");
    expect(fanOut).toHaveBeenCalledWith("peers.local", "s3cret");
  });

  it("skips fan-out when no peers host is configured", async () => {
    delete process.env.REVALIDATE_PEERS_HOST;
    parseBody.mockResolvedValue({ isValidSignature: true, body: {} });
    expect((await POST(req())).status).toBe(200);
    expect(fanOut).not.toHaveBeenCalled();
  });

  it("accepts a fan-out call with the right secret and does not fan out again", async () => {
    const res = await POST(req({ "x-revalidate-fanout": "s3cret" }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("sanity");
    expect(parseBody).not.toHaveBeenCalled();
    expect(fanOut).not.toHaveBeenCalled();
  });

  it("rejects a fan-out call with the wrong secret", async () => {
    const res = await POST(req({ "x-revalidate-fanout": "nope" }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("fails closed when the secret is not configured", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;
    const res = await POST(req({ "x-revalidate-fanout": "" }));
    expect(res.status).toBe(500);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
