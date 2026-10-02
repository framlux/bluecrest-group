import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { isPortalEnabled } from "@/lib/portal/flag";
import PortalSidebar from "@/components/portal/PortalSidebar";

export const metadata = {
  title: {
    default: "Client Portal | BlueCrest Group",
    template: "%s | BlueCrest Portal",
  },
};

// The flag check below runs before auth() (which reads headers), so without this
// Next would prerender portal pages at build time and hit the database.
export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isPortalEnabled()) notFound();

  const session = await auth();

  if (!session?.user) {
    redirect("/portal/login");
  }

  return (
    <div className="flex min-h-screen">
      <PortalSidebar user={session.user} />
      <main className="flex-1 bg-[var(--color-gray-50)] p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
