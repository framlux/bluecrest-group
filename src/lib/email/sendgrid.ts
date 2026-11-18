import sgMail from '@sendgrid/mail';
import { siteConfig } from '@/data/site-config';
import { formatUsPhone } from '@/lib/phone';

// The key is read when sending, not at import, so the image builds without it.

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

export type Lead = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  company?: string;
  timeline?: string;
  details?: string;
  /** Path of the page the form was submitted from, e.g. "/services/fractional-cfo". */
  sourcePage?: string;
  submittedAt: Date;
};

const NOT_PROVIDED = '—';

/**
 * Data for the internal notification template (SENDGRID_TEMPLATE_ID). Keys match the template's
 * Handlebars tags. SendGrid escapes {{tags}}, so visitor input is safe to pass as is.
 */
export function internalTemplateData(lead: Lead) {
  return {
    submitted_at: `${lead.submittedAt.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short',
    })} PT`,
    full_name: lead.name,
    company: lead.company || NOT_PROVIDED,
    email: lead.email,
    // Also used as tel:{{phone}}, so keep it to digits and hyphens.
    phone: formatUsPhone(lead.phone),
    service_interest: lead.projectType,
    source_page: lead.sourcePage ? `${siteConfig.url}${lead.sourcePage}` : NOT_PROVIDED,
    inquiry_message: lead.details || NOT_PROVIDED,
    // Not in the template yet; add a {{timeline}} row to show it.
    timeline: lead.timeline || NOT_PROVIDED,
  };
}

/** Data for the customer confirmation template (SENDGRID_TEMPLATE_CONFIRMATION). Optional blocks use {{#if}}, so omit empty values. */
export function customerTemplateData(lead: Lead) {
  return {
    first_name: lead.name.trim().split(/\s+/)[0] || undefined,
    service_interest: lead.projectType,
    inquiry_message: lead.details || undefined,
  };
}

function sender() {
  const email = process.env.SENDGRID_FROM_EMAIL || 'info@bluecrest-group.com';
  return {
    from: { email, name: process.env.SENDGRID_FROM_NAME || siteConfig.businessName },
    replyTo: process.env.SENDGRID_REPLY_TO || email,
  };
}

function logSendGridError(context: string, error: unknown) {
  console.error(context, error);
  const body = (error as { response?: { body?: unknown } } | null)?.response?.body;
  if (body) console.error('SendGrid error details:', JSON.stringify(body, null, 2));
}

export async function sendCustomerConfirmation(lead: Lead) {
  sgMail.setApiKey(requireEnv('SENDGRID_API_KEY'));

  try {
    await sgMail.send({
      to: lead.email,
      ...sender(),
      templateId: requireEnv('SENDGRID_TEMPLATE_CONFIRMATION'),
      dynamicTemplateData: customerTemplateData(lead),
    });
    console.log('Customer confirmation email sent to:', lead.email);
  } catch (error) {
    logSendGridError('Failed to send customer confirmation email:', error);
    throw error;
  }
}

// Internal lead notification: one send per recipient (no cc/bcc).
export async function sendInternalNotifications(lead: Lead) {
  sgMail.setApiKey(requireEnv('SENDGRID_API_KEY'));
  const templateId = requireEnv('SENDGRID_TEMPLATE_ID');
  const recipients = getNotifyRecipients();
  if (recipients.length === 0) {
    throw new Error('CONTACT_NOTIFY_TO has no valid recipients');
  }

  const dynamicTemplateData = internalTemplateData(lead);
  try {
    await Promise.all(
      recipients.map((to) => sgMail.send({ to, ...sender(), templateId, dynamicTemplateData }))
    );
    console.log('Internal notification emails sent to:', recipients.join(', '));
  } catch (error) {
    logSendGridError('Failed to send internal notification emails:', error);
    throw error;
  }
}
