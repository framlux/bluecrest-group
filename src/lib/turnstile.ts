const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SITEVERIFY_TIMEOUT_MS = 5000;

/** siteverify error codes that mean our configuration is wrong, not the visitor's token. */
const CONFIG_ERROR_CODES = ["missing-input-secret", "invalid-input-secret"];

/**
 * Server-side check of a Cloudflare Turnstile token. False for missing, expired, or reused tokens.
 * Throws when Cloudflare rejects our secret, so a bad deploy surfaces as a logged 500 instead of
 * every visitor silently failing verification.
 */
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
  fetchImpl: typeof fetch = fetch
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) throw new Error("TURNSTILE_SECRET is not set");
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  let data: { success?: boolean; "error-codes"?: string[] };
  try {
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`Turnstile siteverify returned HTTP ${res.status}`);
      return false;
    }
    data = await res.json();
  } catch (error) {
    console.error("Turnstile verification request failed", error);
    return false;
  }

  if (data.success === true) return true;

  const codes = data["error-codes"] ?? [];
  if (codes.some((code) => CONFIG_ERROR_CODES.includes(code))) {
    throw new Error(`Turnstile rejected TURNSTILE_SECRET (${codes.join(", ")})`);
  }
  console.warn(`Turnstile verification failed: ${codes.join(", ") || "no error codes"}`);
  return false;
}
