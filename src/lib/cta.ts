/** Every main call-to-action button (Developer Update List items 13 and 22). */
export const CONTACT_CTA_LABEL = "Book a 15-Min Call";
export const CONTACT_FORM_ID = "contact-form";

/** On /contact, scroll to the form instead of reloading the page (T16). */
export function contactCtaHref(pathname: string | null): string {
  return pathname === "/contact" ? `#${CONTACT_FORM_ID}` : `/contact#${CONTACT_FORM_ID}`;
}
