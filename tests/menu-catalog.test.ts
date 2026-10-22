import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { menuCategories, menuItems } from "../src/lib/menu/georgiano-menu-data";

describe("confirmed Georgiano menu catalog", () => {
  it("contains the five supplied sections and all 72 supplied dishes", () => {
    expect(menuCategories).toHaveLength(5);
    expect(menuItems).toHaveLength(72);
    expect(new Set(menuItems.map((item) => item.id)).size).toBe(72);
  });

  it("preserves the single unlisted price and does not invent taxonomy", () => {
    expect(menuItems.filter((item) => item.priceCents === null).map((item) => item.id)).toEqual(["wood-mushroom-chakapuli"]);
    expect(menuItems.every((item) => item.dietary.length === 0 && item.allergens.length === 0)).toBe(true);
  });

  it("references only images that exist in the public catalog", () => {
    const missing = menuItems
      .filter((item) => item.image)
      .filter((item) => !existsSync(join(process.cwd(), "public", item.image!.replace(/^\//, ""))))
      .map((item) => item.id);
    expect(missing).toEqual([]);
  });

  it("uses the corrected visual mapping for the shifted source files", () => {
    const byId = new Map(menuItems.map((item) => [item.id, item]));
    expect(byId.get("potato-sulguni-pie")?.image).toContain("/40-");
    expect(byId.get("skewered-sulguni-khachapuri")?.image).toContain("/41-");
    expect(byId.get("kubdari")?.image).toContain("/42-");
    expect(byId.get("penovani")?.image).toContain("/43-");
    expect(byId.get("herb-sulguni-kutabi")?.image).toContain("/44-");
    expect(byId.get("beef-cheburek")?.image).toContain("/45-");
    expect(byId.get("sulguni-cheburek")?.image).toContain("/46-");
    expect(byId.get("breaded-house-smoked-sulguni")?.image).toContain("/47-");
  });
});
