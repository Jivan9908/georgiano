import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/server/database";

export const ADMIN_SESSION_COOKIE = "georgiano_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAdminSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1_000);
  await getPrisma().adminSession.create({ data: { userId, tokenHash: hashSessionToken(token), expiresAt } });
  (await cookies()).set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
    priority: "high",
  });
}

export async function getCurrentAdmin() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getPrisma().adminSession.findFirst({
    where: { tokenHash: hashSessionToken(token), revokedAt: null, expiresAt: { gt: new Date() }, user: { isActive: true } },
    include: { user: { select: { id: true, email: true, name: true, isActive: true, lastLoginAt: true } } },
  });
}

export async function requireAdmin() {
  const session = await getCurrentAdmin();
  if (!session) redirect("/admin/login");
  return session.user;
}

export async function requireAdminForMutation() {
  const session = await getCurrentAdmin();
  if (!session) throw new Error("UNAUTHORIZED");
  return session.user;
}

export async function revokeCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) await getPrisma().adminSession.updateMany({ where: { tokenHash: hashSessionToken(token), revokedAt: null }, data: { revokedAt: new Date() } });
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
