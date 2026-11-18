import { describe, it, expect, vi, beforeEach } from "vitest";

const send = vi.hoisted(() => vi.fn().mockResolvedValue([{}]));
vi.mock("@sendgrid/mail", () => ({ default: { setApiKey: vi.fn(), send } }));

import { sendInternalNotifications, sendCustomerConfirmation, getNotifyRecipients, internalTemplateData, customerTemplateData, type Lead } from "./sendgrid";

const lead: Lead = { name: "A", email: "a@example.com", phone: "9495550100", projectType: "Other", submittedAt: new Date() };

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
    await expect(sendInternalNotifications(lead)).rejects.toThrow(/SENDGRID_API_KEY/);
    await expect(sendCustomerConfirmation(lead)).rejects.toThrow(/SENDGRID_API_KEY/);
  });

  it("uses the internal template for the lead and the confirmation template for the customer", async () => {
    await sendInternalNotifications(lead);
    expect(send.mock.calls[0][0]).toMatchObject({ to: "info@bluecrest-group.com", templateId: "d-internal" });
    await sendCustomerConfirmation(lead);
    expect(send.mock.calls[1][0]).toMatchObject({ to: "a@example.com", templateId: "d-confirm" });
  });

  it("throws when a template ID is not configured", async () => {
    delete process.env.SENDGRID_TEMPLATE_ID;
    await expect(sendInternalNotifications(lead)).rejects.toThrow(/SENDGRID_TEMPLATE_ID/);
  });

  it("throws instead of silently dropping the lead when CONTACT_NOTIFY_TO has no valid recipients", async () => {
    process.env.CONTACT_NOTIFY_TO = " , ";
    await expect(sendInternalNotifications(lead)).rejects.toThrow(/CONTACT_NOTIFY_TO has no valid recipients/);
    expect(send).not.toHaveBeenCalled();
  });

  it("reads comma-separated recipients from CONTACT_NOTIFY_TO", () => {
    process.env.CONTACT_NOTIFY_TO = "josh@x.com, ops@x.com ,";
    expect(getNotifyRecipients()).toEqual(["josh@x.com", "ops@x.com"]);
  });

  it("fills every tag in the internal template", () => {
    const data = internalTemplateData({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "(949) 555-0100",
      company: "Acme",
      projectType: "Fractional CFO",
      timeline: "ASAP",
      details: "Need help with cash flow",
      sourcePage: "/services/fractional-cfo",
      submittedAt: new Date("2026-11-17T22:30:00Z"),
    });
    expect(data).toEqual({
      submitted_at: "Nov 17, 2026, 2:30 PM PT",
      full_name: "Jane Doe",
      company: "Acme",
      email: "jane@example.com",
      phone: "949-555-0100",
      service_interest: "Fractional CFO",
      source_page: "https://bluecrest-group.com/services/fractional-cfo",
      inquiry_message: "Need help with cash flow",
      timeline: "ASAP",
    });
  });

  it("shows a dash for optional fields left blank in the internal template", () => {
    expect(internalTemplateData(lead)).toMatchObject({ company: "—", source_page: "—", inquiry_message: "—", timeline: "—" });
  });

  it("gives the customer template a first name and omits empty optional blocks", () => {
    expect(customerTemplateData({ ...lead, name: "  Jane  Doe ", details: "Hello" })).toEqual({
      first_name: "Jane",
      service_interest: "Other",
      inquiry_message: "Hello",
    });
    expect(customerTemplateData({ ...lead, name: " " })).toEqual({
      first_name: undefined,
      service_interest: "Other",
      inquiry_message: undefined,
    });
  });

  it("sends each template its own data", async () => {
    await sendInternalNotifications(lead);
    expect(send.mock.calls[0][0].dynamicTemplateData).toEqual(internalTemplateData(lead));
    await sendCustomerConfirmation(lead);
    expect(send.mock.calls[1][0].dynamicTemplateData).toEqual(customerTemplateData(lead));
  });
});
