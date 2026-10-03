import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_CACHE_TAG } from "@/lib/sanity.cache";
import { FANOUT_HEADER, fanOutRevalidate } from "@/lib/revalidate";

function secretsMatch(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("SANITY_REVALIDATE_SECRET is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Pod-to-pod call from another replica's fan-out.
  const fanoutSecret = req.headers.get(FANOUT_HEADER);
  if (fanoutSecret !== null) {
    if (!secretsMatch(fanoutSecret, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    revalidateTag(SANITY_CACHE_TAG);
    return NextResponse.json({ revalidated: true });
  }

  // Webhook from Sanity: verify the signature (parseBody also waits briefly for the
  // Content Lake to become consistent before we refetch).
  const { isValidSignature } = await parseBody(req, secret);
  if (isValidSignature !== true) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG);

  const peersHost = process.env.REVALIDATE_PEERS_HOST;
  const peers = peersHost ? await fanOutRevalidate(peersHost, secret) : [];
  return NextResponse.json({ revalidated: true, peers });
}
