import { describe, it, expect, vi, beforeEach } from "vitest";

const sendInternal = vi.hoisted(() => vi.fn());
const sendConfirm = vi.hoisted(() => vi.fn());
const verify = vi.hoisted(() => vi.fn());

vi.mock("@/lib/email/sendgrid", () => ({
  sendInternalNotifications: sendInternal,
  sendCustomerConfirmation: sendConfirm,
}));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: verify }));
vi.mock("@/lib/brand", () => ({ getBrand: () => ({ company_name: "BlueCrest Group" }) }));

import { POST } from "./route";

const valid = { name: "A", email: "a@example.com", phone: "9495550100", projectType: "Other", turnstileToken: "tok" };

function req(body: object) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  verify.mockResolvedValue(true);
  sendInternal.mockResolvedValue(undefined);
  sendConfirm.mockResolvedValue(undefined);
});

describe("POST /api/contact", () => {
  it("400s on missing required fields", async () => {
    expect((await POST(req({ ...valid, email: "" }))).status).toBe(400);
  });

  it("403s and sends nothing when Turnstile fails", async () => {
    verify.mockResolvedValue(false);
    const res = await POST(req(valid));
    expect(res.status).toBe(403);
    expect(sendInternal).not.toHaveBeenCalled();
    expect(sendConfirm).not.toHaveBeenCalled();
  });

  it("passes the token and client IP to Turnstile", async () => {
    await POST(req(valid));
    expect(verify).toHaveBeenCalledWith("tok", "1.2.3.4");
  });

  it("502s when the internal notification fails, and skips the customer email", async () => {
    sendInternal.mockRejectedValue(new Error("SendGrid down"));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
    expect(sendConfirm).not.toHaveBeenCalled();
  });

  it("still 200s when only the customer confirmation fails", async () => {
    sendConfirm.mockRejectedValue(new Error("bounce"));
    expect((await POST(req(valid))).status).toBe(200);
  });

  it("200s on the happy path with both emails sent", async () => {
    expect((await POST(req(valid))).status).toBe(200);
    expect(sendInternal).toHaveBeenCalledTimes(1);
    expect(sendConfirm).toHaveBeenCalledTimes(1);
  });
});
