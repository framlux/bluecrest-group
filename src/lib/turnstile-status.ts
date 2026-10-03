/** How long the contact form waits for a Turnstile token before showing the email fallback. */
export const TURNSTILE_TIMEOUT_MS = 15_000;

interface TurnstileStatus {
  siteKey: string;
  /** The widget or its script reported an error. */
  errored: boolean;
  /** Time since the form mounted without a token arriving. */
  elapsedMs: number;
  hasToken: boolean;
}

/**
 * True when the spam check cannot produce a token, so the form must offer the email fallback.
 * A token always wins: a later success clears an earlier error or timeout.
 */
export function isTurnstileFailed({ siteKey, errored, elapsedMs, hasToken }: TurnstileStatus): boolean {
  if (hasToken) return false;
  return !siteKey || errored || elapsedMs >= TURNSTILE_TIMEOUT_MS;
}
