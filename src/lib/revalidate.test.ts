import { describe, it, expect, vi } from "vitest";
import { fanOutRevalidate, FANOUT_HEADER } from "./revalidate";

describe("fanOutRevalidate", () => {
  it("POSTs to every resolved pod with the shared secret", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const result = await fanOutRevalidate("peers.local", "s3cret", {
      resolve: async () => ["10.0.0.1", "10.0.0.2"],
      fetchImpl,
      port: "3000",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl).toHaveBeenCalledWith("http://10.0.0.1:3000/api/revalidate", expect.objectContaining({
      method: "POST",
      headers: { [FANOUT_HEADER]: "s3cret" },
    }));
    expect(result).toEqual([{ ip: "10.0.0.1", ok: true }, { ip: "10.0.0.2", ok: true }]);
  });

  it("reports a dead or failing peer without throwing", async () => {
    const fetchImpl = vi.fn()
      .mockRejectedValueOnce(new Error("ECONNREFUSED"))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));
    const result = await fanOutRevalidate("peers.local", "s", {
      resolve: async () => ["10.0.0.1", "10.0.0.2"],
      fetchImpl,
      port: "3000",
    });
    expect(result).toEqual([{ ip: "10.0.0.1", ok: false }, { ip: "10.0.0.2", ok: false }]);
  });

  it("returns empty when DNS resolution fails", async () => {
    const result = await fanOutRevalidate("peers.local", "s", {
      resolve: async () => { throw new Error("ENOTFOUND"); },
      fetchImpl: vi.fn(),
      port: "3000",
    });
    expect(result).toEqual([]);
  });
});
