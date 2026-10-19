import "server-only";
import { PUBLIC_MENU_QUERY } from "@/lib/domain/public-menu-query";
import { getPrisma } from "../database";
import { executeDatabaseOperation } from "../data-access-error";

export function getPublicMenu() {
  return executeDatabaseOperation("menu.public.read", () => getPrisma().menuCategory.findMany(PUBLIC_MENU_QUERY));
}

export function getMenuForAdministration() {
  return executeDatabaseOperation("menu.admin.read", () => getPrisma().menuCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { items: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] } },
  }));
}
