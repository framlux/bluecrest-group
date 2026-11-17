import { NextResponse } from "next/server";

// Read per request so the site key comes from the pod's env, not the build.
export const dynamic = "force-dynamic";

/** The public Turnstile site key for ContactForm. An empty key makes the form show its email fallback. */
export function GET() {
  return NextResponse.json(
    { siteKey: process.env.TURNSTILE_SITE_KEY ?? "" },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}
