import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PortalSidebar from "@/components/portal/PortalSidebar";

export const metadata = {
  title: {
    default: "Client Portal | BlueCrest Group",
    template: "%s | BlueCrest Portal",
  },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
