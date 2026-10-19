import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "@node-rs/argon2";
import { PrismaClient } from "../src/generated/prisma/client";
import { adminBootstrapSchema } from "../src/lib/validation/admin";

const input = adminBootstrapSchema.parse({ email: process.env.ADMIN_EMAIL, name: process.env.ADMIN_NAME, password: process.env.ADMIN_PASSWORD });
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });

async function bootstrap() {
  const existing = await prisma.adminUser.findUnique({ where: { email: input.email } });
  if (existing) throw new Error("An administrator with this email already exists. Bootstrap never overwrites credentials.");
  const passwordHash = await hash(input.password, { memoryCost: 65_536, timeCost: 3, parallelism: 1 });
  const user = await prisma.adminUser.create({ data: { email: input.email, name: input.name, passwordHash: passwordHash } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, actorIdentifier: user.email, action: "ADMIN_BOOTSTRAPPED", entityType: "AdminUser", entityId: user.id } });
  console.info(`Administrator created for ${user.email}.`);
}

bootstrap().catch((error) => { console.error(error instanceof Error ? error.message : "Bootstrap failed."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
