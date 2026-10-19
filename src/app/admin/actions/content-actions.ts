"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminForMutation } from "@/lib/server/auth/session";
import { writeAuditLog } from "@/lib/server/audit";
import { getPrisma } from "@/lib/server/database";
import { dollarsToCents } from "@/lib/domain/money";
import { canDeleteMenuCategory } from "@/lib/domain/admin-policy";
import { storeAdminImage } from "@/lib/server/media-storage";
import { menuCategoryInputSchema, menuItemInputSchema, restaurantSettingsInputSchema } from "@/lib/validation";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const optional = (formData: FormData, key: string) => text(formData, key) || null;
const integer = (formData: FormData, key: string) => Number.parseInt(text(formData, key) || "0", 10);
const checked = (formData: FormData, key: string) => formData.get(key) === "on";

function refreshMenu() { revalidatePath("/menu"); revalidatePath("/"); revalidatePath("/admin/menu"); revalidatePath("/admin/categories"); }

export async function saveCategoryAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const id = optional(formData, "id");
  const data = menuCategoryInputSchema.parse({ name: text(formData, "name"), slug: text(formData, "slug"), description: optional(formData, "description"), sortOrder: integer(formData, "sortOrder"), isVisible: checked(formData, "isVisible") });
  const category = id ? await getPrisma().menuCategory.update({ where: { id }, data }) : await getPrisma().menuCategory.create({ data });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: id ? "CATEGORY_UPDATED" : "CATEGORY_CREATED", entityType: "MenuCategory", entityId: category.id, metadata: { name: category.name, slug: category.slug } });
  refreshMenu();
  redirect("/admin/categories?success=saved");
}

export async function deleteCategoryAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const id = text(formData, "id");
  if (text(formData, "confirmation") !== "DELETE") redirect("/admin/categories?error=confirmation");
  const category = await getPrisma().menuCategory.findUniqueOrThrow({ where: { id }, include: { _count: { select: { items: true } } } });
  if (!canDeleteMenuCategory(category._count.items)) redirect("/admin/categories?error=contains-items");
  await getPrisma().menuCategory.delete({ where: { id } });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "CATEGORY_DELETED", entityType: "MenuCategory", entityId: id, metadata: { name: category.name } });
  refreshMenu();
  redirect("/admin/categories?success=deleted");
}

export async function saveMenuItemAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const id = optional(formData, "id");
  const upload = formData.get("imageFile");
  let imageUrl = optional(formData, "imageUrl");
  if (upload instanceof File && upload.size > 0) imageUrl = (await storeAdminImage(upload)).url;
  const price = text(formData, "price");
  const data = menuItemInputSchema.parse({
    name: text(formData, "name"), slug: text(formData, "slug"), description: text(formData, "description"),
    priceCents: price ? dollarsToCents(price) : null, imageUrl, imageAlt: optional(formData, "imageAlt"),
    categoryId: text(formData, "categoryId"), status: text(formData, "status"), featured: checked(formData, "featured"),
    dietaryTagIds: formData.getAll("dietaryTagIds").map(String), allergenIds: formData.getAll("allergenIds").map(String), sortOrder: integer(formData, "sortOrder"),
  });
  const { dietaryTagIds, allergenIds, ...itemData } = data;
  const item = await getPrisma().$transaction(async (tx) => {
    const saved = id ? await tx.menuItem.update({ where: { id }, data: itemData }) : await tx.menuItem.create({ data: itemData });
    await tx.menuItemDietaryTag.deleteMany({ where: { menuItemId: saved.id } });
    await tx.menuItemAllergen.deleteMany({ where: { menuItemId: saved.id } });
    if (dietaryTagIds.length) await tx.menuItemDietaryTag.createMany({ data: dietaryTagIds.map((dietaryTagId) => ({ menuItemId: saved.id, dietaryTagId })) });
    if (allergenIds.length) await tx.menuItemAllergen.createMany({ data: allergenIds.map((allergenId) => ({ menuItemId: saved.id, allergenId })) });
    return saved;
  });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: id ? "MENU_ITEM_UPDATED" : "MENU_ITEM_CREATED", entityType: "MenuItem", entityId: item.id, metadata: { name: item.name, status: item.status, featured: item.featured } });
  refreshMenu();
  redirect(`/admin/menu/${item.id}?success=saved`);
}

export async function quickMenuStatusAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!["AVAILABLE", "SOLD_OUT", "HIDDEN"].includes(status)) throw new Error("Invalid status.");
  const item = await getPrisma().menuItem.update({ where: { id }, data: { status: status as "AVAILABLE" | "SOLD_OUT" | "HIDDEN" } });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "MENU_STATUS_CHANGED", entityType: "MenuItem", entityId: item.id, metadata: { status: item.status } });
  refreshMenu();
}

export async function deleteMenuItemAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const id = text(formData, "id");
  if (text(formData, "confirmation") !== "DELETE") redirect(`/admin/menu/${id}?error=confirmation`);
  const item = await getPrisma().menuItem.delete({ where: { id } });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "MENU_ITEM_DELETED", entityType: "MenuItem", entityId: id, metadata: { name: item.name } });
  refreshMenu();
  redirect("/admin/menu?success=deleted");
}

export async function saveTaxonomyAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const kind = text(formData, "kind");
  const id = optional(formData, "id");
  const data = { name: text(formData, "name"), slug: text(formData, "slug"), description: optional(formData, "description") };
  const record = kind === "allergen" ? (id ? await getPrisma().allergen.update({ where: { id }, data }) : await getPrisma().allergen.create({ data })) : (id ? await getPrisma().dietaryTag.update({ where: { id }, data }) : await getPrisma().dietaryTag.create({ data }));
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "MENU_TAXONOMY_SAVED", entityType: kind === "allergen" ? "Allergen" : "DietaryTag", entityId: record.id, metadata: { name: record.name } });
  revalidatePath("/admin/menu/taxonomy");
  redirect("/admin/menu/taxonomy?success=saved");
}

export async function deleteTaxonomyAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const kind = text(formData, "kind");
  const id = text(formData, "id");
  if (text(formData, "confirmation") !== "DELETE") redirect("/admin/menu/taxonomy?error=confirmation");
  const references = kind === "allergen" ? await getPrisma().menuItemAllergen.count({ where: { allergenId: id } }) : await getPrisma().menuItemDietaryTag.count({ where: { dietaryTagId: id } });
  if (references) redirect("/admin/menu/taxonomy?error=referenced");
  if (kind === "allergen") await getPrisma().allergen.delete({ where: { id } }); else await getPrisma().dietaryTag.delete({ where: { id } });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "MENU_TAXONOMY_DELETED", entityType: kind === "allergen" ? "Allergen" : "DietaryTag", entityId: id });
  revalidatePath("/admin/menu/taxonomy");
  redirect("/admin/menu/taxonomy?success=deleted");
}

export async function saveGalleryAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const id = optional(formData, "id");
  const upload = formData.get("imageFile");
  let imageUrl = text(formData, "imageUrl");
  if (upload instanceof File && upload.size > 0) imageUrl = (await storeAdminImage(upload)).url;
  if (!imageUrl) throw new Error("An image URL or upload is required.");
  const data = { imageUrl, altText: text(formData, "altText"), caption: optional(formData, "caption"), sortOrder: integer(formData, "sortOrder"), isVisible: checked(formData, "isVisible") };
  const image = id ? await getPrisma().galleryImage.update({ where: { id }, data }) : await getPrisma().galleryImage.create({ data });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: id ? "GALLERY_UPDATED" : "GALLERY_CREATED", entityType: "GalleryImage", entityId: image.id, metadata: { imageUrl: image.imageUrl } });
  revalidatePath("/"); revalidatePath("/admin/gallery");
  redirect("/admin/gallery?success=saved");
}

export async function deleteGalleryAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const id = text(formData, "id");
  if (text(formData, "confirmation") !== "DELETE") redirect("/admin/gallery?error=confirmation");
  const image = await getPrisma().galleryImage.delete({ where: { id } });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "GALLERY_DELETED", entityType: "GalleryImage", entityId: id, metadata: { imageUrl: image.imageUrl } });
  revalidatePath("/"); revalidatePath("/admin/gallery");
  redirect("/admin/gallery?success=deleted");
}

export async function saveHomepageSectionAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const id = text(formData, "id");
  const upload = formData.get("mediaFile");
  let mediaUrl = optional(formData, "mediaUrl");
  if (upload instanceof File && upload.size > 0) mediaUrl = (await storeAdminImage(upload)).url;
  const section = await getPrisma().homepageSection.update({ where: { id }, data: { eyebrow: optional(formData, "eyebrow"), headline: optional(formData, "headline"), supportingText: optional(formData, "supportingText"), mediaUrl, mediaAlt: optional(formData, "mediaAlt"), isVisible: checked(formData, "isVisible") } });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "HOMEPAGE_SECTION_UPDATED", entityType: "HomepageSection", entityId: id, metadata: { key: section.key } });
  revalidatePath("/"); revalidatePath("/admin/homepage");
  redirect("/admin/homepage?success=saved");
}

export async function saveSettingsAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const parsed = restaurantSettingsInputSchema.omit({ businessServiceWindows: true, specialBusinessHours: true }).parse({ restaurantName: text(formData, "restaurantName"), addressLine1: optional(formData, "addressLine1"), addressLine2: optional(formData, "addressLine2"), city: optional(formData, "city"), state: optional(formData, "state"), postalCode: optional(formData, "postalCode"), phone: optional(formData, "phone"), email: optional(formData, "email"), timezone: "America/Los_Angeles", instagramUrl: optional(formData, "instagramUrl"), facebookUrl: optional(formData, "facebookUrl"), directionsUrl: optional(formData, "directionsUrl"), orderingEnabled: checked(formData, "orderingEnabled") });
  const settings = await getPrisma().restaurantSettings.update({ where: { key: "primary" }, data: parsed });
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "RESTAURANT_SETTINGS_UPDATED", entityType: "RestaurantSettings", entityId: settings.id });
  revalidatePath("/"); revalidatePath("/contact"); revalidatePath("/admin/settings");
  redirect("/admin/settings?success=saved");
}

export async function updateRecordStatusAction(formData: FormData) {
  const admin = await requireAdminForMutation();
  const type = text(formData, "type"); const id = text(formData, "id"); const status = text(formData, "status"); const internalNotes = optional(formData, "internalNotes");
  if (type === "reservation") await getPrisma().reservation.update({ where: { id }, data: { status: status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW", internalNotes } });
  else if (type === "privateDining") await getPrisma().privateDiningInquiry.update({ where: { id }, data: { status: status as "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "DECLINED", internalNotes } });
  else if (type === "contact") await getPrisma().contactInquiry.update({ where: { id }, data: { status: status as "NEW" | "IN_PROGRESS" | "CLOSED", internalNotes } });
  else throw new Error("Unsupported record type.");
  await writeAuditLog({ actorUserId: admin.id, actorIdentifier: admin.email, action: "OPERATIONAL_RECORD_UPDATED", entityType: type, entityId: id, metadata: { status } });
  revalidatePath("/admin");
}
