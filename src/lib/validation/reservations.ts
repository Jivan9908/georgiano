import { z } from "zod";
import { absoluteDateTimeSchema, emailSchema, nonEmptyText, optionalText, phoneSchema } from "./common";

export const reservationInputSchema = z.object({
  guestName: nonEmptyText(160),
  email: emailSchema,
  phone: phoneSchema,
  partySize: z.int().min(1).max(1_000),
  reservationAt: absoluteDateTimeSchema,
  specialOccasion: optionalText(160),
  specialRequests: optionalText(4_000),
});

export type ReservationInput = z.input<typeof reservationInputSchema>;
