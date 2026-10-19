import { notFound } from "next/navigation";
import { AdminNotice, AdminPageHeader } from "@/components/admin/admin-ui";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { getPrisma } from "@/lib/server/database";

export default async function EditMenuItemPage({ params, searchParams }: PageProps<"/admin/menu/[id]">) {
  const { id } = await params; const query = await searchParams;
  const [item, categories, dietaryTags, allergens] = await Promise.all([getPrisma().menuItem.findUnique({ where: { id }, include: { dietaryTags: true, allergens: true } }), getPrisma().menuCategory.findMany({ orderBy: { sortOrder: "asc" } }), getPrisma().dietaryTag.findMany({ orderBy: { name: "asc" } }), getPrisma().allergen.findMany({ orderBy: { name: "asc" } })]);
  if (!item) notFound();
  return <><AdminPageHeader eyebrow="Menu item" title={item.name} description="Edit price, status, media, category, and explicit food information." />{query.success ? <AdminNotice>Item saved successfully.</AdminNotice> : null}{query.error ? <AdminNotice tone="error">Type DELETE exactly to confirm removal.</AdminNotice> : null}<MenuItemForm item={item} categories={categories} dietaryTags={dietaryTags} allergens={allergens} /></>;
}
