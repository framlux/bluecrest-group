"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT_CTA_LABEL, contactCtaHref } from "@/lib/cta";

export default function ContactCta({
  className,
  onClick,
  icon,
  label = CONTACT_CTA_LABEL,
}: {
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  /** Only for the documented exceptions (About and case study pages read "Contact Us"). */
  label?: string;
}) {
  const pathname = usePathname();
  return (
    <Link href={contactCtaHref(pathname)} className={className} onClick={onClick}>
      {icon}
      {label}
    </Link>
  );
}
