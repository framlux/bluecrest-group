import { describe, it, expect } from "vitest";
import { formatUsPhone, telHref } from "./phone";

describe("telHref", () => {
  it("normalises US numbers", () => {
    expect(telHref("(949) 555-0100")).toBe("tel:+19495550100");
    expect(telHref("949.555.0100")).toBe("tel:+19495550100");
    expect(telHref("+1 949 555 0100")).toBe("tel:+19495550100");
  });
  it("returns null for empty or malformed numbers", () => {
    expect(telHref("")).toBeNull();
    expect(telHref("555-0100")).toBeNull();
  });
});

describe("formatUsPhone", () => {
  it("formats 10- and 11-digit US numbers with hyphens", () => {
    expect(formatUsPhone("(949) 555-0100")).toBe("949-555-0100");
    expect(formatUsPhone("+1 949 555 0100")).toBe("949-555-0100");
  });

  it("returns anything else trimmed, unchanged", () => {
    expect(formatUsPhone(" 555-0100 ")).toBe("555-0100");
  });
});
