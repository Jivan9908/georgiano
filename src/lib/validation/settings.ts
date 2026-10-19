import { z } from "zod";
import { localDateSchema, minuteOfDaySchema, nonEmptyText, optionalText, optionalUrl, timeWindowSchema } from "./common";

const dayOfWeekSchema = z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]);

const serviceWindowSchema = timeWindowSchema.and(z.object({
  dayOfWeek: dayOfWeekSchema,
  label: optionalText(80),
  isVisible: z.boolean().default(true),
}));

const specialHoursSchema = z.object({
  localDate: localDateSchema,
  isClosed: z.boolean(),
  label: optionalText(120),
  startMinute: minuteOfDaySchema.optional().nullable(),
  endMinute: z.int().min(1).max(1_440).optional().nullable(),
}).superRefine((value, context) => {
  if (!value.isClosed && (value.startMinute == null || value.endMinute == null)) context.addIssue({ code: "custom", message: "Open special hours require start and end times." });
  if (value.startMinute != null && value.endMinute != null && value.endMinute <= value.startMinute) context.addIssue({ code: "custom", path: ["endMinute"], message: "End time must be later than start time." });
});

export const restaurantSettingsInputSchema = z.object({
  restaurantName: nonEmptyText(160),
  addressLine1: optionalText(200),
  addressLine2: optionalText(200),
  city: optionalText(120),
  state: optionalText(80),
  postalCode: optionalText(24),
  phone: optionalText(40),
  email: z.union([z.email().max(254), z.literal("")]).optional().nullable().transform((value) => value || null),
  timezone: z.literal("America/Los_Angeles"),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  directionsUrl: optionalUrl,
  orderingEnabled: z.boolean().default(false),
  businessServiceWindows: z.array(serviceWindowSchema).default([]),
  specialBusinessHours: z.array(specialHoursSchema).default([]),
});

export const reservationSettingsInputSchema = z.object({
  enabled: z.boolean().default(false),
  minimumLeadTimeMinutes: z.int().min(0).max(525_600).optional().nullable(),
  maximumAdvanceDays: z.int().positive().max(730).optional().nullable(),
  maximumPartySize: z.int().positive().max(1_000).optional().nullable(),
  reservationIntervalMinutes: z.int().positive().max(1_440).optional().nullable(),
  defaultDurationMinutes: z.int().positive().max(1_440).optional().nullable(),
});

export type RestaurantSettingsInput = z.infer<typeof restaurantSettingsInputSchema>;
