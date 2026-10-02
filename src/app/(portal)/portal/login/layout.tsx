import { notFound } from "next/navigation";
import { isPortalEnabled } from "@/lib/portal/flag";

export const metadata = {
  title: "Sign In | BlueCrest Portal",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isPortalEnabled()) notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-gray-50)] p-4">
      {children}
    </div>
  );
}
