/** tel: link for a US number, or null when the number is empty or malformed (T15). */
export function telHref(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? `tel:+1${digits}` : null;
}
