"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT_CTA_LABEL, contactCtaHref } from "@/lib/cta";

export default function ContactCta({
  className,
  onClick,
  icon,
}: {
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link href={contactCtaHref(pathname)} className={className} onClick={onClick}>
      {icon}
      {CONTACT_CTA_LABEL}
    </Link>
  );
}
