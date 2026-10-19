import { describe, expect, it } from "vitest";
import { isPublicMenuItem } from "../src/lib/domain/menu-policy";
import { createOrderItemSnapshot } from "../src/lib/domain/order-snapshot";
import { PUBLIC_MENU_QUERY } from "../src/lib/domain/public-menu-query";

describe("public menu policy", () => {
  it("never exposes hidden items", () => {
    expect(isPublicMenuItem({ status: "AVAILABLE" })).toBe(true);
    expect(isPublicMenuItem({ status: "SOLD_OUT" })).toBe(true);
    expect(isPublicMenuItem({ status: "HIDDEN" })).toBe(false);
    expect(PUBLIC_MENU_QUERY.include.items.where.status.not).toBe("HIDDEN");
  });
});

describe("order history snapshots", () => {
  it("preserves the item name and price at ordering time", () => {
    const menuItem = { id: "item-1", name: "Development Khinkali", priceCents: 1800 };
    const snapshot = createOrderItemSnapshot(menuItem, 2);
    menuItem.name = "Renamed Khinkali";
    menuItem.priceCents = 2200;

    expect(snapshot).toEqual({
      menuItemId: "item-1",
      itemNameSnapshot: "Development Khinkali",
      itemPriceCentsSnapshot: 1800,
      quantity: 2,
      lineTotalCents: 3600,
    });
  });

  it("rejects invalid prices and quantities", () => {
    expect(() => createOrderItemSnapshot({ id: "item-1", name: "Dish", priceCents: -1 }, 1)).toThrow(RangeError);
    expect(() => createOrderItemSnapshot({ id: "item-1", name: "Dish", priceCents: 100 }, 0)).toThrow(RangeError);
  });
});
