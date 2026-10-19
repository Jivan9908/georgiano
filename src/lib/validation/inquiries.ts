import { z } from "zod";
import { emailSchema, localDateSchema, nonEmptyText, optionalText, phoneSchema } from "./common";

export const privateDiningInquiryInputSchema = z.object({
  fullName: nonEmptyText(160),
  email: emailSchema,
  phone: phoneSchema,
  eventType: nonEmptyText(120),
  preferredDate: localDateSchema.optional().nullable(),
  guestCount: z.int().positive().max(10_000).optional().nullable(),
  eventDetails: optionalText(6_000),
});

export const contactInquiryInputSchema = z.object({
  name: nonEmptyText(160),
  email: emailSchema,
  phone: optionalText(40),
  subject: nonEmptyText(240),
  message: nonEmptyText(6_000),
});

export type PrivateDiningInquiryInput = z.infer<typeof privateDiningInquiryInputSchema>;
export type ContactInquiryInput = z.infer<typeof contactInquiryInputSchema>;
