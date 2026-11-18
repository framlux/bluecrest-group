import { NextResponse } from "next/server";
import { sendCustomerConfirmation, sendInternalNotifications, type Lead } from "@/lib/email/sendgrid";
import { verifyTurnstile } from "@/lib/turnstile";

function clientIp(request: Request): string | undefined {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? undefined;
}

/** A site path like "/contact", or undefined. The value comes from the browser, so accept only a short path. */
function safeSourcePage(value: unknown): string | undefined {
  return typeof value === "string" && /^\/[\w\-/]{0,200}$/.test(value) ? value : undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, projectType, timeline, details, sourcePage, turnstileToken } = body;

    if (!name || !email || !phone || !projectType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!(await verifyTurnstile(turnstileToken, clientIp(request)))) {
      return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 403 });
    }

    const lead: Lead = {
      name: String(name),
      email: String(email),
      phone: String(phone),
      projectType: String(projectType),
      company: company ? String(company) : undefined,
      timeline: timeline ? String(timeline) : undefined,
      details: details ? String(details) : undefined,
      sourcePage: safeSourcePage(sourcePage),
      submittedAt: new Date(),
    };

    // The lead must reach the firm. If it does not, tell the visitor so they can retry or email.
    try {
      await sendInternalNotifications(lead);
    } catch (error) {
      console.error("Contact form: internal notification failed", error);
      return NextResponse.json({ error: "We could not send your message." }, { status: 502 });
    }

    try {
      await sendCustomerConfirmation(lead);
    } catch (error) {
      console.error("Contact form: customer confirmation failed (lead was delivered)", error);
    }

    return NextResponse.json({ message: "Form submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
