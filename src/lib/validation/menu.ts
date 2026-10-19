import { z } from "zod";
import { cuidSchema, nonEmptyText, optionalText, optionalUrl, positiveCentsSchema, slugSchema, sortOrderSchema } from "./common";

export const menuCategoryInputSchema = z.object({
  name: nonEmptyText(120),
  slug: slugSchema,
  description: optionalText(1_000),
  sortOrder: sortOrderSchema.default(0),
  isVisible: z.boolean().default(true),
});

export const menuItemInputSchema = z.object({
  name: nonEmptyText(160),
  slug: slugSchema,
  description: nonEmptyText(2_000),
  priceCents: positiveCentsSchema.nullable(),
  imageUrl: optionalUrl,
  imageAlt: optionalText(300),
  categoryId: cuidSchema,
  status: z.enum(["AVAILABLE", "SOLD_OUT", "HIDDEN"]).default("AVAILABLE"),
  featured: z.boolean().default(false),
  dietaryTagIds: z.array(cuidSchema).max(50).default([]),
  allergenIds: z.array(cuidSchema).max(50).default([]),
  sortOrder: sortOrderSchema.default(0),
});

export type MenuCategoryInput = z.infer<typeof menuCategoryInputSchema>;
export type MenuItemInput = z.infer<typeof menuItemInputSchema>;
