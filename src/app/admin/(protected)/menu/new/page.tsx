import { AdminPageHeader } from "@/components/admin/admin-ui";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { getPrisma } from "@/lib/server/database";

export default async function NewMenuItemPage() {
  const [categories, dietaryTags, allergens] = await Promise.all([getPrisma().menuCategory.findMany({ orderBy: { sortOrder: "asc" } }), getPrisma().dietaryTag.findMany({ orderBy: { name: "asc" } }), getPrisma().allergen.findMany({ orderBy: { name: "asc" } })]);
  return <><AdminPageHeader eyebrow="Menu" title="Add Item" description="Create a database-backed menu item." /><MenuItemForm categories={categories} dietaryTags={dietaryTags} allergens={allergens} /></>;
}
