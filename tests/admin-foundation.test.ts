import { describe, expect, it } from "vitest";
import { canDeleteMenuCategory } from "../src/lib/domain/admin-policy";
import { centsToDollars, dollarsToCents } from "../src/lib/domain/money";
import { menuItemInputSchema } from "../src/lib/validation";

describe("admin money conversion", () => {
  it("converts decimal strings without floating-point rounding", () => {
    expect(dollarsToCents("18.95")).toBe(1895);
    expect(dollarsToCents("18.9")).toBe(1890);
    expect(centsToDollars(1895)).toBe("18.95");
  });

  it("rejects fractional cents and unsafe values", () => {
    expect(() => dollarsToCents("18.999")).toThrow(RangeError);
    expect(() => dollarsToCents("90071992547410.00")).toThrow(RangeError);
  });
});

describe("admin destructive-action policy", () => {
  it("allows only empty categories to be deleted", () => {
    expect(canDeleteMenuCategory(0)).toBe(true);
    expect(canDeleteMenuCategory(1)).toBe(false);
    expect(canDeleteMenuCategory(-1)).toBe(false);
  });
});

describe("admin media input validation", () => {
  const baseItem = {
    name: "Test Dish",
    slug: "test-dish",
    description: "Test description",
    priceCents: 1895,
    categoryId: "cm12345678901234567890123",
  };

  it("accepts safe local paths and http(s) URLs but rejects active protocols", () => {
    expect(menuItemInputSchema.safeParse({ ...baseItem, imageUrl: "/media/dish.png" }).success).toBe(true);
    expect(menuItemInputSchema.safeParse({ ...baseItem, imageUrl: "https://images.example.com/dish.webp" }).success).toBe(true);
    expect(menuItemInputSchema.safeParse({ ...baseItem, imageUrl: "javascript:alert(1)" }).success).toBe(false);
  });
});
