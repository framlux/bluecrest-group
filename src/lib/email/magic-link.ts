import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendMagicLinkEmail(email: string, url: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY not set, skipping magic link email");
    console.log("Magic link URL (dev):", url);
    return;
  }

  const fromEmail =
    process.env.SENDGRID_FROM_EMAIL || "info@bluecrest-group.com";
  const fromName = process.env.SENDGRID_FROM_NAME || "BlueCrest Group";

  const msg = {
    to: email,
    from: { email: fromEmail, name: fromName },
    subject: "Sign in to BlueCrest Portal",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Poppins', Arial, sans-serif; background: #F9FAFB; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://bluecrest-group.com/images/bluecrest-group-logo.png" alt="BlueCrest Group" style="height: 48px;" />
          </div>
          <h1 style="font-size: 24px; color: #111827; text-align: center; margin-bottom: 16px; font-weight: 600;">
            Sign in to your portal
          </h1>
          <p style="color: #6B7280; text-align: center; margin-bottom: 32px; line-height: 1.6;">
            Click the button below to securely sign in to your BlueCrest Group client portal.
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #579cc6 0%, #4889b5 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 9999px; font-weight: 600; font-size: 16px;">
              Sign In
            </a>
          </div>
          <p style="color: #9CA3AF; font-size: 13px; text-align: center; line-height: 1.5;">
            This link expires in 24 hours. If you didn&apos;t request this email, you can safely ignore it.
          </p>
        </div>
        <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 24px;">
          BlueCrest Group &middot; Orange County, California
        </p>
      </div>
    `,
    text: `Sign in to BlueCrest Portal\n\nClick this link to sign in: ${url}\n\nThis link expires in 24 hours.`,
  };

  try {
    await sgMail.send(msg);
    console.log("Magic link email sent to:", email);
  } catch (error) {
    console.error("Failed to send magic link email:", error);
    throw error;
  }
}
