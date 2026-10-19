import type { Metadata } from "next";
import { MenuPage } from "@/components/menu/menu-page";
import { menuCategories, menuItems, type MenuItem } from "@/lib/menu/georgiano-menu-data";
import "./menu.css";

export const metadata: Metadata = {
  title: "Menu",
  description: "Explore the Georgiano menu of traditional Georgian soups, hot dishes, khachapuri, cold appetizers, and salads in North Hollywood.",
};

async function loadMenu() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { getPublicMenu } = await import("@/lib/server/repositories/menu-repository");
    const databaseMenu = await getPublicMenu();
    const categories = databaseMenu.map((category) => ({ id: category.slug, name: category.name, introduction: category.description ?? "", sortOrder: category.sortOrder }));
    const items: MenuItem[] = databaseMenu.flatMap((category) => category.items.map((item) => ({
      id: item.slug, name: item.name, description: item.description, priceCents: item.priceCents, image: item.imageUrl, imageAlt: item.imageAlt ?? undefined,
      categoryId: category.slug, status: item.status === "AVAILABLE" ? "available" : item.status === "SOLD_OUT" ? "sold-out" : "hidden",
      featured: item.featured, dietary: item.dietaryTags.map((link) => link.dietaryTag.name), allergens: item.allergens.map((link) => link.allergen.name), sortOrder: item.sortOrder,
    })));
    return { categories, items };
  } catch (error) {
    console.error("Public menu database read failed; rendering approved fallback.", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}

export default async function MenuRoute() {
  const menu = await loadMenu();
  return <MenuPage categories={menu?.categories.length ? menu.categories : menuCategories} items={menu?.categories.length ? menu.items : menuItems} />;
}
