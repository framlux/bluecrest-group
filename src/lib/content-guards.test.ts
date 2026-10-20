import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// Public-facing source only; tests and the portal are excluded.
const files = [...walk("src/app/(public)"), ...walk("src/components"), ...walk("src/data"), "src/lib/structured-data.ts"]
  .filter((f) => /\.tsx?$/.test(f) && !f.includes(".test.") && !f.includes("/portal/") && !f.endsWith("redirects.ts"));

describe("removed wording stays removed (Oct 13 update list)", () => {
  const banned = [
    "Tax and Audit Support",
    "Business Consulting",
    "$1M",
    "Founder and CEO",
    "Connect Your Business to Success",
    "Ready to Transform Your Financial Operations",
    "Services Offered",
    "Service Area Coverage",
    "Principles That Guide Our Work",
  ];

  it.each(files)("%s", (f) => {
    const text = readFileSync(f, "utf8");
    banned.forEach((phrase) => expect(text, phrase).not.toContain(phrase));
  });

  it('"nationwide" appears only in the homepage Who We Are section (item 12)', () => {
    const hits = files.filter((f) => /nationwide/i.test(readFileSync(f, "utf8")));
    expect(hits).toEqual(["src/components/HomePageClient.tsx"]);
  });
});
