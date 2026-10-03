import { describe, it, expect } from "vitest";
import { isTurnstileFailed, TURNSTILE_TIMEOUT_MS } from "./turnstile-status";

const base = { siteKey: "site-key", errored: false, elapsedMs: 0, hasToken: false };

describe("isTurnstileFailed", () => {
  it("waits for the widget while it is still loading", () => {
    expect(isTurnstileFailed(base)).toBe(false);
    expect(isTurnstileFailed({ ...base, elapsedMs: TURNSTILE_TIMEOUT_MS - 1 })).toBe(false);
  });

  it("fails when the site key is empty", () => {
    expect(isTurnstileFailed({ ...base, siteKey: "" })).toBe(true);
  });

  it("fails when the widget or its script errored", () => {
    expect(isTurnstileFailed({ ...base, errored: true })).toBe(true);
  });

  it("fails once 15 seconds pass without a token", () => {
    expect(TURNSTILE_TIMEOUT_MS).toBe(15_000);
    expect(isTurnstileFailed({ ...base, elapsedMs: TURNSTILE_TIMEOUT_MS })).toBe(true);
    expect(isTurnstileFailed({ ...base, elapsedMs: TURNSTILE_TIMEOUT_MS + 5_000 })).toBe(true);
  });

  it("a token clears every failure condition", () => {
    expect(isTurnstileFailed({ ...base, errored: true, hasToken: true })).toBe(false);
    expect(isTurnstileFailed({ ...base, elapsedMs: TURNSTILE_TIMEOUT_MS, hasToken: true })).toBe(false);
  });
});
