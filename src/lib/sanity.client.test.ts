import { describe, it, expect, vi } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const fetchMock = vi.hoisted(() => vi.fn().mockResolvedValue([]));
vi.mock("@sanity/client", () => ({ createClient: () => ({ fetch: fetchMock }) }));

import { fetchSanity, SANITY_CACHE_TAG, SANITY_REVALIDATE_SECONDS } from "./sanity.client";

describe("fetchSanity", () => {
  it("fetches with the 5-minute revalidate and the sanity tag", async () => {
    await fetchSanity("*[_type == 'article']", { a: 1 });
    expect(fetchMock).toHaveBeenCalledWith("*[_type == 'article']", { a: 1 }, {
      next: { revalidate: SANITY_REVALIDATE_SECONDS, tags: [SANITY_CACHE_TAG] },
    });
    expect(SANITY_REVALIDATE_SECONDS).toBe(300);
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("no permanent caching of Sanity data", () => {
  it("no source file under src uses force-cache", () => {
    const offenders = walk("src")
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith(".test.ts"))
      .filter((f) => readFileSync(f, "utf8").includes("force-cache"));
    expect(offenders).toEqual([]);
  });
});
