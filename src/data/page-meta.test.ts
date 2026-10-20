import { describe, it, expect } from "vitest";
import { pageMeta } from "./page-meta";
import { fullTitle } from "@/lib/metadata";

const entries = Object.entries(pageMeta).filter(([k]) => k !== "notFound") as [string, { path: string; title: string; description: string; absoluteTitle?: boolean }][];

describe("pageMeta", () => {
  it.each(entries)("%s: title carries no brand unless absolute", (_k, m) => {
    if (!m.absoluteTitle) expect(m.title).not.toContain("BlueCrest Group");
  });

  it.each(entries)("%s: full title fits in 60 characters", (_k, m) => {
    expect(fullTitle(m.title, m.absoluteTitle).length).toBeLessThanOrEqual(60);
  });

  it.each(entries)("%s: title has no em dash", (_k, m) => {
    expect(m.title).not.toContain("—");
  });

  it("descriptions are unique", () => {
    const d = entries.map(([, m]) => m.description);
    expect(new Set(d).size).toBe(d.length);
  });

  it.each(entries)("%s: description has no doubled word, lowercase acronym, revenue minimum, or consulting (T7, items 4 and 26)", (_k, m) => {
    expect(m.description).not.toMatch(/\b(\w+)\s+\1\b/i);
    expect(m.description).not.toMatch(/\b(cfo|kpi|hr)\b/);
    expect(m.description).not.toMatch(/\$1M|consulting|advisory/i);
  });

  it("paths are unique and root-relative", () => {
    const p = entries.map(([, m]) => m.path);
    expect(new Set(p).size).toBe(p.length);
    p.forEach((x) => expect(x.startsWith("/")).toBe(true));
  });
});
