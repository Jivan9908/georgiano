import { z } from "zod";
import { emailSchema, nonEmptyText } from "./common";

export const adminLoginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(256) });
export const adminBootstrapSchema = z.object({ email: emailSchema, name: nonEmptyText(120), password: z.string().min(14).max(256) });
export const adminProfileSchema = z.object({ name: nonEmptyText(120) });
export const adminPasswordChangeSchema = z.object({ currentPassword: z.string().min(1).max(256), newPassword: z.string().min(14).max(256) }).refine((value) => value.currentPassword !== value.newPassword, { path: ["newPassword"], message: "Choose a different password." });
