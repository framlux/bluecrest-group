import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({ auth: mockAuth }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const mockSendMagicLink = vi.fn();
vi.mock("@/lib/email/magic-link", () => ({
  sendMagicLinkEmail: mockSendMagicLink,
}));

// Track calls
const mockSelectResult = vi.fn();
const mockInsertValues = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: (...args: unknown[]) => mockSelectResult(...args),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: (...args: unknown[]) => {
        mockInsertValues(...args);
        return {
          returning: vi.fn().mockResolvedValue([{ id: "new-user-id" }]),
        };
      },
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  users: Symbol("users"),
  companyAccess: Symbol("companyAccess"),
}));

vi.mock("drizzle-orm", () => ({ eq: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("user actions", () => {
  it("should throw Unauthorized when a non-admin calls inviteUser", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "client" } });
    const { inviteUser } = await import("./actions");
    const fd = new FormData();
    fd.set("email", "test@test.com");
    fd.set("name", "Test");
    await expect(inviteUser(fd)).rejects.toThrow("Unauthorized");
  });

  it("should return an error when email is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { inviteUser } = await import("./actions");
    const fd = new FormData();
    fd.set("name", "Test");
    const result = await inviteUser(fd);
    expect(result.error).toContain("Email");
  });

  it("should return an error when name is missing", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { inviteUser } = await import("./actions");
    const fd = new FormData();
    fd.set("email", "test@test.com");
    const result = await inviteUser(fd);
    expect(result.error).toContain("Name");
  });

  it("should return an error when a user with that email already exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockSelectResult.mockResolvedValueOnce([{ id: "existing-user" }]);
    const { inviteUser } = await import("./actions");
    const fd = new FormData();
    fd.set("email", "existing@test.com");
    fd.set("name", "Existing User");
    const result = await inviteUser(fd);
    expect(result.error).toContain("already exists");
  });

  it("should create user and company access when given a new email", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockSelectResult.mockResolvedValueOnce([]); // no existing user
    const { inviteUser } = await import("./actions");
    const fd = new FormData();
    fd.set("email", "new@test.com");
    fd.set("name", "New User");
    fd.append("companyIds", "c1");
    fd.append("companyIds", "c2");
    const result = await inviteUser(fd);
    expect(result.success).toBe(true);
    // Should have inserted user and company access
    expect(mockInsertValues).toHaveBeenCalled();
  });

  it("should send a magic link email after creating the user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockSelectResult.mockResolvedValueOnce([]);
    const { inviteUser } = await import("./actions");
    const fd = new FormData();
    fd.set("email", "new@test.com");
    fd.set("name", "New User");
    await inviteUser(fd);
    expect(mockSendMagicLink).toHaveBeenCalled();
  });

  it("should not fail if the email send throws", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    mockSelectResult.mockResolvedValueOnce([]);
    mockSendMagicLink.mockRejectedValueOnce(new Error("SMTP fail"));
    const { inviteUser } = await import("./actions");
    const fd = new FormData();
    fd.set("email", "new@test.com");
    fd.set("name", "New User");
    const result = await inviteUser(fd);
    expect(result.success).toBe(true); // still succeeds
  });

  it("should delete a user when called by admin", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1", role: "admin" } });
    const { removeUser } = await import("./actions");
    const result = await removeUser("u2");
    expect(result.success).toBe(true);
  });
});
