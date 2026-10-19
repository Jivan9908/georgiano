import { describe, expect, it } from "vitest";
import { contactInquiryInputSchema, menuItemInputSchema, orderTotalsSchema, reservationInputSchema } from "../src/lib/validation";

const validMenuItem = {
  name: "Development Dish",
  slug: "development-dish",
  description: "Temporary development description.",
  priceCents: 1800,
  categoryId: "cm12345678901234567890123",
};

describe("server input validation", () => {
  it("accepts integer cents or an unlisted price and rejects negative or fractional prices", () => {
    expect(menuItemInputSchema.safeParse(validMenuItem).success).toBe(true);
    expect(menuItemInputSchema.safeParse({ ...validMenuItem, priceCents: null }).success).toBe(true);
    expect(menuItemInputSchema.safeParse({ ...validMenuItem, priceCents: -1 }).success).toBe(false);
    expect(menuItemInputSchema.safeParse({ ...validMenuItem, priceCents: 18.5 }).success).toBe(false);
  });

  it("rejects invalid reservation party sizes", () => {
    const reservation = {
      guestName: "Test Guest",
      email: "guest@example.com",
      phone: "818-555-0100",
      partySize: 2,
      reservationAt: "2026-10-20T19:30:00-07:00",
    };
    expect(reservationInputSchema.safeParse(reservation).success).toBe(true);
    expect(reservationInputSchema.safeParse({ ...reservation, partySize: 0 }).success).toBe(false);
    expect(reservationInputSchema.safeParse({ ...reservation, partySize: 2.5 }).success).toBe(false);
  });

  it("enforces required inquiry fields", () => {
    expect(contactInquiryInputSchema.safeParse({ email: "guest@example.com" }).success).toBe(false);
    expect(contactInquiryInputSchema.safeParse({ name: "Guest", email: "guest@example.com", subject: "Question", message: "Hello" }).success).toBe(true);
  });

  it("requires totals to equal subtotal plus tax", () => {
    expect(orderTotalsSchema.safeParse({ subtotalCents: 1000, taxCents: 95, totalCents: 1095 }).success).toBe(true);
    expect(orderTotalsSchema.safeParse({ subtotalCents: 1000, taxCents: 95, totalCents: 1100 }).success).toBe(false);
  });
});
