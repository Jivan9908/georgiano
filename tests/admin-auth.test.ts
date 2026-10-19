import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ get: vi.fn(() => undefined), set: vi.fn(), delete: vi.fn() })),
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/server/database", () => ({ getPrisma: vi.fn() }));

describe("admin authentication", () => {
  beforeEach(() => vi.clearAllMocks());

  it("hashes passwords with Argon2id and verifies only the correct password", async () => {
    const { hashPassword, verifyPassword } = await import("../src/lib/server/auth/password");
    const passwordHash = await hashPassword("a-strong-test-password");

    expect(passwordHash).toMatch(/^\$argon2id\$/);
    await expect(verifyPassword(passwordHash, "a-strong-test-password")).resolves.toBe(true);
    await expect(verifyPassword(passwordHash, "wrong-password")).resolves.toBe(false);
  });

  it("rejects a server-side mutation when the secure session cookie is missing", async () => {
    const { requireAdminForMutation } = await import("../src/lib/server/auth/session");
    await expect(requireAdminForMutation()).rejects.toThrow("UNAUTHORIZED");
  });
});
