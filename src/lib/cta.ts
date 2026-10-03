export const CONTACT_CTA_LABEL = "Contact Us";
export const CONTACT_FORM_ID = "contact-form";

/** On /contact, scroll to the form instead of reloading the page (T16). */
export function contactCtaHref(pathname: string | null): string {
  return pathname === "/contact" ? `#${CONTACT_FORM_ID}` : `/contact#${CONTACT_FORM_ID}`;
}
