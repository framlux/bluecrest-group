import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { isPortalEnabled } from "@/lib/portal/flag";

type PortalHandler = (req: NextRequest, event: NextFetchEvent) => Response | Promise<Response>;

async function portalMiddleware(req: NextRequest, event: NextFetchEvent) {
  // Imported lazily: @/lib/auth pulls in postgres, which throws while the Edge runtime
  // evaluates the module, so a static import would 500 before the flag check ran.
  const { auth } = await import("@/lib/auth");

  const handler = auth((authReq) => {
    const { pathname } = authReq.nextUrl;

    // Allow login page and auth API routes without auth
    if (
      pathname === "/portal/login" ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!authReq.auth) {
      const loginUrl = new URL("/portal/login", authReq.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only routes
    if (pathname.startsWith("/portal/admin")) {
      if (authReq.auth.user.role !== "admin") {
        return NextResponse.redirect(new URL("/portal/dashboard", authReq.url));
      }
    }

    return NextResponse.next();
  });

  return (handler as unknown as PortalHandler)(req, event);
}

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!isPortalEnabled()) {
    return new NextResponse(null, { status: 404 });
  }
  return portalMiddleware(req, event);
}

export const config = {
  matcher: ["/portal/:path*", "/api/auth/:path*"],
};
