import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

// Mock auth to pass through the handler function directly
vi.mock("@/lib/auth", () => ({
  auth: vi.fn((handler: Function) => handler),
}));

// Import the middleware (which is now the raw handler due to the mock)
import middleware from "./middleware";

function fakeReq(
  pathname: string,
  session: { user: { role: string } } | null
) {
  return {
    nextUrl: {
      pathname,
      searchParams: new URLSearchParams(),
    },
    url: `http://localhost:3000${pathname}`,
    auth: session,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("middleware", () => {
  it("should allow /portal/login without authentication", () => {
    const req = fakeReq("/portal/login", null);
    const response = (middleware as Function)(req);
    // NextResponse.next() returns a Response-like — it should NOT be a redirect
    expect(response).toBeDefined();
    expect(response.status).not.toBe(307);
  });

  it("should allow /api/auth routes without authentication", () => {
    const req = fakeReq("/api/auth/callback/email", null);
    const response = (middleware as Function)(req);
    expect(response).toBeDefined();
    expect(response.status).not.toBe(307);
  });

  it("should redirect unauthenticated users from /portal/dashboard to /portal/login", () => {
    const req = fakeReq("/portal/dashboard", null);
    const response = (middleware as Function)(req);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("/portal/login");
  });

  it("should redirect non-admin users from /portal/admin to /portal/dashboard", () => {
    const req = fakeReq("/portal/admin", { user: { role: "client" } });
    const response = (middleware as Function)(req);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("/portal/dashboard");
  });

  it("should allow admin users to access /portal/admin", () => {
    const req = fakeReq("/portal/admin", { user: { role: "admin" } });
    const response = (middleware as Function)(req);
    expect(response.status).not.toBe(307);
  });

  it("should allow authenticated client users to access /portal/dashboard", () => {
    const req = fakeReq("/portal/dashboard", { user: { role: "client" } });
    const response = (middleware as Function)(req);
    expect(response.status).not.toBe(307);
  });
});
