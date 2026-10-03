import { lookup } from "node:dns/promises";

/** Header carrying the shared secret on pod-to-pod revalidation calls. */
export const FANOUT_HEADER = "x-revalidate-fanout";

export interface FanOutDeps {
  resolve: (host: string) => Promise<string[]>;
  fetchImpl: typeof fetch;
  port: string;
}

async function resolveAll(host: string): Promise<string[]> {
  const records = await lookup(host, { all: true, family: 4 });
  return records.map((r) => r.address);
}

const defaultDeps = (): FanOutDeps => ({
  resolve: resolveAll,
  fetchImpl: fetch,
  port: process.env.PORT || "3000",
});

/**
 * Each pod has its own ISR cache, and the Service delivers the Sanity webhook to only
 * one of them. Tell every pod (resolved through the headless Service) to revalidate.
 * Includes this pod; a second revalidate is harmless. Failures are reported, not thrown;
 * the 5-minute interval refresh covers any pod that misses the call.
 */
export async function fanOutRevalidate(
  host: string,
  secret: string,
  deps: FanOutDeps = defaultDeps()
): Promise<{ ip: string; ok: boolean }[]> {
  let ips: string[];
  try {
    ips = await deps.resolve(host);
  } catch (error) {
    console.error("Revalidate fan-out: could not resolve peers", error);
    return [];
  }

  return Promise.all(
    ips.map(async (ip) => {
      try {
        const res = await deps.fetchImpl(`http://${ip}:${deps.port}/api/revalidate`, {
          method: "POST",
          headers: { [FANOUT_HEADER]: secret },
          signal: AbortSignal.timeout(3000),
        });
        return { ip, ok: res.ok };
      } catch (error) {
        console.error(`Revalidate fan-out to ${ip} failed`, error);
        return { ip, ok: false };
      }
    })
  );
}
