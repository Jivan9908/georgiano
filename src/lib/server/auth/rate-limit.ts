import "server-only";
import { createHash } from "node:crypto";
import { getPrisma } from "@/lib/server/database";

const WINDOW_MS = 15 * 60 * 1_000;
const MAX_FAILURES = 5;

export function hashIpAddress(ipAddress: string) {
  return createHash("sha256").update(`georgiano-admin:${ipAddress}`).digest("hex");
}

export async function isLoginRateLimited(email: string, ipHash: string) {
  const since = new Date(Date.now() - WINDOW_MS);
  const failures = await getPrisma().adminLoginAttempt.count({ where: { succeeded: false, createdAt: { gte: since }, OR: [{ email }, { ipHash }] } });
  return failures >= MAX_FAILURES;
}

export function recordLoginAttempt(email: string, ipHash: string, succeeded: boolean) {
  return getPrisma().adminLoginAttempt.create({ data: { email, ipHash, succeeded } });
}
