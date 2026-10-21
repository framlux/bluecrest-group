"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-config";
import ContactCta from "@/components/ContactCta";

/** Pages that already end on a form or their own closing call to action. */
function endsWithOwnAsk(pathname: string) {
  return ["/", "/contact", "/about", "/service-areas"].includes(pathname) || pathname.startsWith("/case-studies/");
}

/** The site's one footer call to action (item 10), skipped where the page has just asked. */
export default function FooterCta() {
  const pathname = usePathname() ?? "";
  if (endsWithOwnAsk(pathname)) return null;

  return (
    <div className="mb-12">
      <h2 className="text-3xl lg:text-4xl font-bold !text-white mb-3">Let&apos;s Talk About Your Business</h2>
      <p className="text-gray-300 text-lg mb-6">
        Fractional CFO and accounting services for small and growing businesses in {siteConfig.region}.
      </p>
      <ContactCta className="btn-primary px-8 py-4 rounded-full font-semibold inline-block" />
    </div>
  );
}
