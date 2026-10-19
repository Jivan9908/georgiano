import { z } from "zod";

export const cuidSchema = z.string().cuid2();
export const slugSchema = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");
export const nonEmptyText = (maximum: number) => z.string().trim().min(1).max(maximum);
export const optionalText = (maximum: number) => z.string().trim().max(maximum).optional().nullable();
const safeUrl = z.string().trim().refine((value) => {
  if (/^\/[a-zA-Z0-9/_\-.]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}, "Use an http(s) URL or a safe root-relative path.");
export const optionalUrl = z.union([safeUrl, z.literal("")]).optional().nullable().transform((value) => value || null);
export const emailSchema = z.email().max(254).transform((value) => value.trim().toLowerCase());
export const phoneSchema = z.string().trim().min(7).max(40);
export const positiveCentsSchema = z.int().nonnegative().max(100_000_000);
export const sortOrderSchema = z.int().min(0).max(1_000_000);
export const localDateSchema = z.iso.date();
export const absoluteDateTimeSchema = z.iso.datetime({ offset: true }).transform((value) => new Date(value));
export const minuteOfDaySchema = z.int().min(0).max(1_439);

export const timeWindowSchema = z.object({
  startMinute: minuteOfDaySchema,
  endMinute: z.int().min(1).max(1_440),
}).refine(({ startMinute, endMinute }) => endMinute > startMinute, {
  message: "End time must be later than start time.",
  path: ["endMinute"],
});
