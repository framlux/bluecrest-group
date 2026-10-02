import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock auth to pass through the handler function directly
const authMock = vi.hoisted(() => vi.fn((handler: unknown) => handler));
vi.mock("@/lib/auth", () => ({ auth: authMock }));

// Import the middleware (which wraps the raw handler due to the mock)
import middleware from "./middleware";

type Handler = (req: unknown) => Promise<Response>;
const callMiddleware = middleware as unknown as Handler;

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
  // Clear call history only; mockReset would drop the pass-through implementation.
  authMock.mockClear();
  process.env.PORTAL_ENABLED = "true";
});

afterEach(() => {
  delete process.env.PORTAL_ENABLED;
});

describe("middleware with portal disabled", () => {
  beforeEach(() => {
    delete process.env.PORTAL_ENABLED;
  });

  it.each(["/portal", "/portal/login", "/portal/admin", "/api/auth/session"])(
    "returns 404 for %s",
    async (path) => {
      const response = await callMiddleware(fakeReq(path, { user: { role: "admin" } }));
      expect(response.status).toBe(404);
      expect(authMock).not.toHaveBeenCalled();
    }
  );

  it("treats any value other than 'true' as disabled", async () => {
    process.env.PORTAL_ENABLED = "1";
    const response = await callMiddleware(fakeReq("/portal/dashboard", null));
    expect(response.status).toBe(404);
    expect(authMock).not.toHaveBeenCalled();
  });
});

describe("middleware", () => {
  it("hands the request to auth when the portal is enabled", async () => {
    await callMiddleware(fakeReq("/portal/login", null));
    expect(authMock).toHaveBeenCalledTimes(1);
  });

  it("should allow /portal/login without authentication", async () => {
    const req = fakeReq("/portal/login", null);
    const response = await callMiddleware(req);
    // NextResponse.next() returns a Response-like — it should NOT be a redirect
    expect(response).toBeDefined();
    expect(response.status).not.toBe(307);
  });

  it("should allow /api/auth routes without authentication", async () => {
    const req = fakeReq("/api/auth/callback/email", null);
    const response = await callMiddleware(req);
    expect(response).toBeDefined();
    expect(response.status).not.toBe(307);
  });

  it("should redirect unauthenticated users from /portal/dashboard to /portal/login", async () => {
    const req = fakeReq("/portal/dashboard", null);
    const response = await callMiddleware(req);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("/portal/login");
  });

  it("should redirect non-admin users from /portal/admin to /portal/dashboard", async () => {
    const req = fakeReq("/portal/admin", { user: { role: "client" } });
    const response = await callMiddleware(req);
    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("/portal/dashboard");
  });

  it("should allow admin users to access /portal/admin", async () => {
    const req = fakeReq("/portal/admin", { user: { role: "admin" } });
    const response = await callMiddleware(req);
    expect(response.status).not.toBe(307);
  });

  it("should allow authenticated client users to access /portal/dashboard", async () => {
    const req = fakeReq("/portal/dashboard", { user: { role: "client" } });
    const response = await callMiddleware(req);
    expect(response.status).not.toBe(307);
  });
});
