import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: mockAuth }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const mockSelectLimit = vi.fn();
const mockInsertValues = vi.fn();
const mockDeleteWhere = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: (...args: unknown[]) => mockSelectLimit(...args),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: (...args: unknown[]) => {
        mockInsertValues(...args);
        return Promise.resolve();
      },
    }),
    delete: vi.fn().mockReturnValue({
      where: (...args: unknown[]) => {
        mockDeleteWhere(...args);
        return Promise.resolve();
      },
    }),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  companyAccess: Symbol("companyAccess"),
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  and: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("access actions", () => {
  it("should throw Unauthorized when a non-admin calls grantAccess", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "client" } });
    const { grantAccess } = await import("./actions");
    await expect(grantAccess("u2", "c1")).rejects.toThrow("Unauthorized");
  });

  it("should return an error when user already has access", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockSelectLimit.mockResolvedValueOnce([{ id: "existing" }]);
    const { grantAccess } = await import("./actions");
    const result = await grantAccess("u2", "c1");
    expect(result.error).toContain("already has access");
  });

  it("should insert a companyAccess record when no prior access exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockSelectLimit.mockResolvedValueOnce([]);
    const { grantAccess } = await import("./actions");
    const result = await grantAccess("u2", "c1");
    expect(result.success).toBe(true);
    expect(mockInsertValues).toHaveBeenCalled();
  });

  it("should throw Unauthorized when a non-admin calls revokeAccess", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "client" } });
    const { revokeAccess } = await import("./actions");
    await expect(revokeAccess("u2", "c1")).rejects.toThrow("Unauthorized");
  });

  it("should delete the companyAccess record on revoke", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { revokeAccess } = await import("./actions");
    const result = await revokeAccess("u2", "c1");
    expect(result.success).toBe(true);
    expect(mockDeleteWhere).toHaveBeenCalled();
  });
});
