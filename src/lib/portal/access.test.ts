import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation — notFound and redirect throw to halt execution
const mockNotFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
const mockRedirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
  redirect: mockRedirect,
}));

// Mock auth
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

// Mock db
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: (...args: unknown[]) => {
      mockSelect(...args);
      return {
        from: (...fArgs: unknown[]) => {
          mockFrom(...fArgs);
          return {
            where: (...wArgs: unknown[]) => {
              mockWhere(...wArgs);
              return {
                limit: (...lArgs: unknown[]) => mockLimit(...lArgs),
              };
            },
          };
        },
      };
    },
  },
}));

vi.mock("@/lib/db/schema", () => ({
  companies: { id: "id" },
  companyAccess: { id: "id", userId: "user_id", companyId: "company_id" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((...args: unknown[]) => args),
  and: vi.fn((...args: unknown[]) => args),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("verifyCompanyAccess", () => {
  it("should redirect to login when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const { verifyCompanyAccess } = await import("./access");

    await expect(verifyCompanyAccess("company-1")).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/portal/login");
  });

  it("should return 404 when company does not exist", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "admin", email: "a@b.com" },
    });
    mockLimit.mockResolvedValueOnce([]); // company not found

    const { verifyCompanyAccess } = await import("./access");

    await expect(verifyCompanyAccess("nonexistent")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("should allow an admin to access any company", async () => {
    const company = { id: "c1", name: "Test Co" };
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "admin", email: "a@b.com" },
    });
    mockLimit.mockResolvedValueOnce([company]); // company found

    const { verifyCompanyAccess } = await import("./access");

    const result = await verifyCompanyAccess("c1");
    expect(result).toEqual(company);
  });

  it("should allow a client user with access to view their company", async () => {
    const company = { id: "c1", name: "Test Co" };
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "client", email: "client@b.com" },
    });
    mockLimit
      .mockResolvedValueOnce([company]) // company found
      .mockResolvedValueOnce([{ id: "access-1" }]); // access record found

    const { verifyCompanyAccess } = await import("./access");

    const result = await verifyCompanyAccess("c1");
    expect(result).toEqual(company);
  });

  it("should return 404 when client user lacks access (not 403)", async () => {
    const company = { id: "c1", name: "Test Co" };
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "client", email: "client@b.com" },
    });
    mockLimit
      .mockResolvedValueOnce([company]) // company found
      .mockResolvedValueOnce([]); // NO access record

    const { verifyCompanyAccess } = await import("./access");

    await expect(verifyCompanyAccess("c1")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockNotFound).toHaveBeenCalled();
  });
});
