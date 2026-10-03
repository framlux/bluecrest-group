import { describe, it, expect } from "vitest";
import { telHref } from "./phone";

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
