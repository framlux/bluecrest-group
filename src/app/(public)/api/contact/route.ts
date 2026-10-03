import { NextResponse } from "next/server";
import { getBrand } from "@/lib/brand";
import { sendCustomerConfirmation, sendInternalNotifications } from "@/lib/email/sendgrid";
import { verifyTurnstile } from "@/lib/turnstile";

function clientIp(request: Request): string | undefined {
  return request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, projectType, timeline, details, turnstileToken } = body;

    if (!name || !email || !phone || !projectType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!(await verifyTurnstile(turnstileToken, clientIp(request)))) {
      return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 403 });
    }

    const brand = {
      ...getBrand(),
      submitted_date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
    const lead = {
      name: String(name),
      email: String(email),
      phone: String(phone).replace(/\D/g, ""),
      phone_plain: String(phone).replace(/\D/g, ""),
      company: company ? String(company) : undefined,
      projectType: String(projectType),
      timeline: timeline ? String(timeline) : undefined,
      projectDescription: details ? String(details) : undefined,
    };

    // The lead must reach the firm. If it does not, tell the visitor so they can retry or email.
    try {
      await sendInternalNotifications(brand, lead);
    } catch (error) {
      console.error("Contact form: internal notification failed", error);
      return NextResponse.json({ error: "We could not send your message." }, { status: 502 });
    }

    try {
      await sendCustomerConfirmation(brand, lead);
    } catch (error) {
      console.error("Contact form: customer confirmation failed (lead was delivered)", error);
    }

    return NextResponse.json({ message: "Form submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
