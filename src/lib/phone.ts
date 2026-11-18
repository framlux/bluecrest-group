/** tel: link for a US number, or null when the number is empty or malformed (T15). */
export function telHref(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? `tel:+1${digits}` : null;
}

/** "949-555-0100" for a US number (also valid inside tel:), or the trimmed input when it isn't one. */
export function formatUsPhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}` : phone.trim();
}
