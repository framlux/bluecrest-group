import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock auth
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: mockAuth }));

// Mock next/cache
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// Mock db
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDeleteFn = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    insert: (...args: unknown[]) => {
      mockInsert(...args);
      return { values: vi.fn().mockReturnThis(), returning: vi.fn().mockResolvedValue([{ id: "new-id" }]) };
    },
    update: (...args: unknown[]) => {
      mockUpdate(...args);
      return { set: vi.fn().mockReturnThis(), where: vi.fn().mockResolvedValue(undefined) };
    },
    delete: (...args: unknown[]) => {
      mockDeleteFn(...args);
      return { where: vi.fn().mockResolvedValue(undefined) };
    },
  },
}));

vi.mock("@/lib/db/schema", () => ({
  companies: Symbol("companies"),
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("company actions", () => {
  it("should throw Unauthorized when a non-admin calls createCompany", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "client" } });
    const { createCompany } = await import("./actions");
    const formData = new FormData();
    formData.set("name", "Test");
    await expect(createCompany(formData)).rejects.toThrow("Unauthorized");
  });

  it("should throw Unauthorized when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { createCompany } = await import("./actions");
    const formData = new FormData();
    formData.set("name", "Test");
    await expect(createCompany(formData)).rejects.toThrow();
  });

  it("should return an error when name is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { createCompany } = await import("./actions");
    const formData = new FormData();
    const result = await createCompany(formData);
    expect(result.error).toBeDefined();
    expect(result.error).toContain("name");
  });

  it("should insert a company when given a valid name", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { createCompany } = await import("./actions");
    const formData = new FormData();
    formData.set("name", "Acme Corp");
    formData.set("industry", "Tech");
    formData.set("fiscalYearStartMonth", "4");
    const result = await createCompany(formData);
    expect(result.success).toBe(true);
    expect(mockInsert).toHaveBeenCalled();
  });

  it("should delete a company when called by admin", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { deleteCompany } = await import("./actions");
    const result = await deleteCompany("c1");
    expect(result.success).toBe(true);
    expect(mockDeleteFn).toHaveBeenCalled();
  });
});
