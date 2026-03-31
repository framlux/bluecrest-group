import { NextResponse } from "next/server";
import { getBrand } from "@/lib/brand";
import { sendCustomerConfirmation, sendInternalNotifications } from "@/lib/email/sendgrid";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, company, email, phone, projectType, timeline, details } = body;

    // Validate required fields
    if (!name || !email || !phone || !projectType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Contact form submission:", {
      name,
      company,
      email,
      phone,
      projectType,
      timeline,
      details,
      timestamp: new Date().toISOString(),
    });

    // Send emails via SendGrid
    const brand = getBrand();
    const lead = {
      name: String(name),
      email: String(email),
      phone: phone ? String(phone).replace(/\D/g, '') : undefined,
      phone_plain: phone ? String(phone).replace(/\D/g, '') : undefined,
      company: company ? String(company) : undefined,
      projectType: String(projectType),
      timeline: timeline ? String(timeline) : undefined,
      projectDescription: details ? String(details) : undefined,
    };

    // Add submitted_date to brand data
    const brandWithDate = {
      ...brand,
      submitted_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    // Send emails via SendGrid
    // Send customer confirmation first, then internal notifications
    const emailErrors: unknown[] = [];
    
    try {
      await sendCustomerConfirmation(brandWithDate, lead);
      console.log('Customer confirmation email sent successfully to:', email);
    } catch (error) {
      console.error("Failed to send customer confirmation email:", error);
      emailErrors.push(error);
      // Don't throw - we still want to try sending internal notifications
    }

    try {
      await sendInternalNotifications(brandWithDate, lead);
      console.log('Internal notification emails sent successfully');
    } catch (error) {
      console.error("Failed to send internal notification emails:", error);
      emailErrors.push(error);
      // Don't throw - form submission should still succeed
    }

    // Log if any emails failed, but don't block form submission
    if (emailErrors.length > 0) {
      console.warn(`Form submitted but ${emailErrors.length} email(s) failed to send. Check SendGrid configuration.`);
    }

    return NextResponse.json(
      { message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
