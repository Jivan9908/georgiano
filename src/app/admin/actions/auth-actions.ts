"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/server/database";
import { writeAuditLog } from "@/lib/server/audit";
import { hashIpAddress, isLoginRateLimited, recordLoginAttempt } from "@/lib/server/auth/rate-limit";
import { hashPassword, verifyPassword } from "@/lib/server/auth/password";
import { createAdminSession, requireAdminForMutation, revokeCurrentAdminSession } from "@/lib/server/auth/session";
import { adminLoginSchema, adminPasswordChangeSchema, adminProfileSchema } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const parsed = adminLoginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) redirect("/admin/login?error=invalid");
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "local";
  const ipHash = hashIpAddress(ip);
  if (await isLoginRateLimited(parsed.data.email, ipHash)) redirect("/admin/login?error=rate-limited");

  const user = await getPrisma().adminUser.findUnique({ where: { email: parsed.data.email } });
  const valid = Boolean(user?.isActive && await verifyPassword(user.passwordHash, parsed.data.password));
  await recordLoginAttempt(parsed.data.email, ipHash, valid);
  if (!valid || !user) redirect("/admin/login?error=invalid");

  await getPrisma().adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createAdminSession(user.id);
  await writeAuditLog({ actorUserId: user.id, actorIdentifier: user.email, action: "ADMIN_LOGIN", entityType: "AdminUser", entityId: user.id });
  redirect("/admin");
}

export async function logoutAction() {
  const admin = await requireAdminForMutation();
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "ADMIN_LOGOUT", entityType: "AdminUser", entityId: admin.id });
  await revokeCurrentAdminSession();
  redirect("/admin/login");
}

export async function updateAccountAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const parsed = adminProfileSchema.parse({ name: formData.get("name") });
  await getPrisma().adminUser.update({ where: { id: admin.id }, data: parsed });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "ADMIN_PROFILE_UPDATED", entityType: "AdminUser", entityId: admin.id });
  redirect("/admin/account?success=profile");
}

export async function changePasswordAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const parsed = adminPasswordChangeSchema.safeParse({ currentPassword: formData.get("currentPassword"), newPassword: formData.get("newPassword") });
  if (!parsed.success) redirect("/admin/account?error=password-policy");
  const user = await getPrisma().adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  if (!await verifyPassword(user.passwordHash, parsed.data.currentPassword)) redirect("/admin/account?error=current-password");
  const passwordHash = await hashPassword(parsed.data.newPassword);
  await getPrisma().$transaction([
    getPrisma().adminUser.update({ where: { id: admin.id }, data: { passwordHash } }),
    getPrisma().adminSession.updateMany({ where: { userId: admin.id, revokedAt: null }, data: { revokedAt: new Date() } }),
    getPrisma().auditLog.create({ data: { actorUserId: admin.id, actorIdentifier: admin.email, action: "ADMIN_PASSWORD_CHANGED", entityType: "AdminUser", entityId: admin.id } }),
  ]);
  await revokeCurrentAdminSession();
  redirect("/admin/login?success=password-changed");
}
