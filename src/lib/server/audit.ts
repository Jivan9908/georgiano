import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/server/database";

type AuditInput = {
  actorUserId?: string;
  actorIdentifier?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
};

export function writeAuditLog(input: AuditInput) {
  return getPrisma().auditLog.create({ data: input });
}
