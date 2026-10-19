import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Allows code generation without credentials but cannot reach a real database.
    // Migration and seed commands must receive an explicit DATABASE_URL.
    url: process.env.DATABASE_URL ?? "postgresql://invalid:invalid@127.0.0.1:1/invalid",
  },
});
