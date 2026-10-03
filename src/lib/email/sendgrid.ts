import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.error('Missing SENDGRID_API_KEY environment variable');
} else {
  // Validate API key format (SendGrid API keys start with "SG.")
  if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    console.warn('SENDGRID_API_KEY does not appear to be in the correct format (should start with "SG.")');
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/** Internal lead recipients: CONTACT_NOTIFY_TO (comma-separated), defaulting to the firm inbox. */
export function getNotifyRecipients(): string[] {
  const raw = process.env.CONTACT_NOTIFY_TO || 'info@bluecrest-group.com';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

type Lead = {
  name: string;
  email: string;
  phone?: string;
  phone_plain?: string;
  company?: string;
  projectType: string;
  projectDescription?: string;
  timeline?: string;
};

type BrandData = {
  // Email template fields
  subject?: string;
  preheader?: string;
  company_name: string;
  logo_url?: string;
  city_state?: string;
  brand_accent?: string;
  cta_dark_bg?: string;
  bg_color?: string;
  text_dark?: string;
  text_muted?: string;
  text_body?: string;
  text_faint?: string;
  border_color?: string;
  card_header_bg?: string;
  hero_title?: string;
  hero_subtitle?: string;
  details_title?: string;
  call_cta_label?: string;
  call_phone?: string;
  call_phone_plain?: string;
  site_cta_label?: string;
  site_url?: string;
  address_line?: string;
  footer_note?: string;
  submitted_date?: string;

  // Legacy fields for backward compatibility
  brand_title?: string;
  brand_tagline?: string;
  brand_dark_bg?: string;
  brand_gold?: string;
  supportPhone?: string;
  supportEmail?: string;
  service_area?: string;
  portfolio_url?: string;
  portfolio_blurb?: string;
  intro_copy?: string;
};

export async function sendCustomerConfirmation(brand: BrandData, lead: Lead) {
  sgMail.setApiKey(requireEnv('SENDGRID_API_KEY'));

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || brand.supportEmail || 'info@bluecrest-group.com';
  const fromName = process.env.SENDGRID_FROM_NAME || brand.company_name;
  const replyTo = process.env.SENDGRID_REPLY_TO || fromEmail;

  const msg = {
    to: lead.email,
    from: { email: fromEmail, name: fromName },
    replyTo: replyTo,
    templateId: requireEnv('SENDGRID_TEMPLATE_CONFIRMATION'),
    dynamicTemplateData: { ...brand, lead },
  };

  try {
    await sgMail.send(msg);
    console.log('Customer confirmation email sent to:', lead.email);
  } catch (error: unknown) {
    console.error('Failed to send customer confirmation email:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const sendGridError = error as { response?: { body?: unknown } };
      if (sendGridError.response?.body) {
        console.error('SendGrid error details:', JSON.stringify(sendGridError.response.body, null, 2));
      }
    }
    throw error;
  }
}

// Internal lead notification: one send per recipient (no cc/bcc)
export async function sendInternalNotifications(brand: BrandData, lead: Lead) {
  sgMail.setApiKey(requireEnv('SENDGRID_API_KEY'));

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || brand.supportEmail || 'info@bluecrest-group.com';
  const fromName = process.env.SENDGRID_FROM_NAME || brand.company_name;
  const replyTo = process.env.SENDGRID_REPLY_TO || fromEmail;
  const recipients = getNotifyRecipients();
  const templateId = requireEnv('SENDGRID_TEMPLATE_ID');

  if (recipients.length === 0) {
    throw new Error('CONTACT_NOTIFY_TO has no valid recipients');
  }

  const sends = recipients.map(email =>
    sgMail.send({
      to: email,
      from: { email: fromEmail, name: fromName },
      replyTo: replyTo,
      templateId,
      dynamicTemplateData: { ...brand, lead },
    })
  );

  try {
    await Promise.all(sends);
    console.log('Internal notification emails sent to:', recipients.join(', '));
  } catch (error: unknown) {
    console.error('Failed to send internal notification emails:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const sendGridError = error as { response?: { body?: unknown } };
      if (sendGridError.response?.body) {
        console.error('SendGrid error details:', JSON.stringify(sendGridError.response.body, null, 2));
      }
    }
    throw error;
  }
}
