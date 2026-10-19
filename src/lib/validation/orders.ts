import { z } from "zod";
import { absoluteDateTimeSchema, cuidSchema, emailSchema, nonEmptyText, optionalText, phoneSchema, positiveCentsSchema } from "./common";

export const orderItemInputSchema = z.object({
  menuItemId: cuidSchema,
  quantity: z.int().positive().max(100),
});

export const orderInputSchema = z.object({
  customerName: nonEmptyText(160),
  customerEmail: emailSchema,
  customerPhone: phoneSchema,
  pickupAt: absoluteDateTimeSchema,
  notes: optionalText(2_000),
  items: z.array(orderItemInputSchema).min(1).max(100),
});

export const orderTotalsSchema = z.object({
  subtotalCents: positiveCentsSchema,
  taxCents: positiveCentsSchema,
  totalCents: positiveCentsSchema,
}).refine(({ subtotalCents, taxCents, totalCents }) => subtotalCents + taxCents === totalCents, {
  message: "Order total must equal subtotal plus tax.",
  path: ["totalCents"],
});

export type OrderInput = z.infer<typeof orderInputSchema>;
