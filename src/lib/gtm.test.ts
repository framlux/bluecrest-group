import { describe, it, expect } from "vitest";
import { GTM_ID, gtmHeadScript, gtmNoscriptSrc } from "./gtm";

describe("Google Tag Manager", () => {
  it("loads the BlueCrest container in both snippets", () => {
    expect(GTM_ID).toBe("GTM-KP2P5CHB");
    expect(gtmHeadScript).toContain("'dataLayer','GTM-KP2P5CHB'");
    expect(gtmHeadScript).toContain("https://www.googletagmanager.com/gtm.js?id=");
    expect(gtmNoscriptSrc).toBe("https://www.googletagmanager.com/ns.html?id=GTM-KP2P5CHB");
  });
});
