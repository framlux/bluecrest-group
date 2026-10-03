import { describe, it, expect, vi, beforeEach } from "vitest";

const send = vi.hoisted(() => vi.fn().mockResolvedValue([{}]));
vi.mock("@sendgrid/mail", () => ({ default: { setApiKey: vi.fn(), send } }));

import { sendInternalNotifications, sendCustomerConfirmation, getNotifyRecipients } from "./sendgrid";

const brand = { company_name: "BlueCrest Group" } as never;
const lead = { name: "A", email: "a@example.com", projectType: "Other" } as never;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.SENDGRID_API_KEY = "SG.test";
  process.env.SENDGRID_TEMPLATE_ID = "d-internal";
  process.env.SENDGRID_TEMPLATE_CONFIRMATION = "d-confirm";
  delete process.env.CONTACT_NOTIFY_TO;
});

describe("sendgrid", () => {
  it("throws instead of silently skipping when the API key is missing", async () => {
    delete process.env.SENDGRID_API_KEY;
    await expect(sendInternalNotifications(brand, lead)).rejects.toThrow(/SENDGRID_API_KEY/);
    await expect(sendCustomerConfirmation(brand, lead)).rejects.toThrow(/SENDGRID_API_KEY/);
  });

  it("uses the internal template for the lead and the confirmation template for the customer", async () => {
    await sendInternalNotifications(brand, lead);
    expect(send.mock.calls[0][0]).toMatchObject({ to: "info@bluecrest-group.com", templateId: "d-internal" });
    await sendCustomerConfirmation(brand, lead);
    expect(send.mock.calls[1][0]).toMatchObject({ to: "a@example.com", templateId: "d-confirm" });
  });

  it("throws when a template ID is not configured", async () => {
    delete process.env.SENDGRID_TEMPLATE_ID;
    await expect(sendInternalNotifications(brand, lead)).rejects.toThrow(/SENDGRID_TEMPLATE_ID/);
  });

  it("reads comma-separated recipients from CONTACT_NOTIFY_TO", () => {
    process.env.CONTACT_NOTIFY_TO = "josh@x.com, ops@x.com ,";
    expect(getNotifyRecipients()).toEqual(["josh@x.com", "ops@x.com"]);
  });
});
