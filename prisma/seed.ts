import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { menuCategories, menuItems } from "../src/lib/menu/georgiano-menu-data";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to seed Georgiano data.");

const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

const statusMap = { available: "AVAILABLE", "sold-out": "SOLD_OUT", hidden: "HIDDEN" } as const;

const legacyCategorySlugs = [
  "cold-appetizers", "hot-appetizers", "salads", "khinkali", "khachapuri", "main-courses",
  "grill", "desserts", "georgian-wine", "cocktails", "non-alcoholic",
];

const legacyItemSlugs = [
  "pkhali-trio", "badrijani", "jonjoli", "lobio-pot", "sulguni", "mushrooms",
  "georgian-salad", "roasted-beet", "khinkali-beef", "khinkali-mushroom", "khinkali-cheese",
  "adjarian", "imeretian", "lobiani", "chkmeruli", "chakapuli", "ojakhuri", "mtsvadi",
  "lamb-kebab", "trout", "churchkhela", "honey-cake", "rkatsiteli", "saperavi", "tsitska",
  "tbilisi-old-fashioned", "tarragon-collins", "tarkhun", "pear-lemonade", "mineral-water",
];

async function seed() {
  // Retire only the known preview records. Owner-created records outside this
  // explicit list are never changed by the catalog import.
  await prisma.menuItem.updateMany({
    where: { slug: { in: legacyItemSlugs } },
    data: { status: "HIDDEN", featured: false },
  });
  await prisma.menuCategory.updateMany({
    where: { slug: { in: legacyCategorySlugs } },
    data: { isVisible: false },
  });

  for (const category of menuCategories) {
    await prisma.menuCategory.upsert({
      where: { slug: category.id },
      update: { name: category.name, description: category.introduction, sortOrder: category.sortOrder, isVisible: true },
      create: { name: category.name, slug: category.id, description: category.introduction, sortOrder: category.sortOrder, isVisible: true },
    });
  }

  for (const item of menuItems) {
    const saved = await prisma.menuItem.upsert({
      where: { slug: item.id },
      update: {
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        imageUrl: item.image,
        imageAlt: item.imageAlt,
        status: statusMap[item.status],
        featured: item.featured,
        sortOrder: item.sortOrder,
        category: { connect: { slug: item.categoryId } },
      },
      create: {
        name: item.name,
        slug: item.id,
        description: item.description,
        priceCents: item.priceCents,
        imageUrl: item.image,
        imageAlt: item.imageAlt,
        status: statusMap[item.status],
        featured: item.featured,
        sortOrder: item.sortOrder,
        category: { connect: { slug: item.categoryId } },
      },
    });
    // The photographed source pages do not provide a verified allergen or
    // dietary taxonomy. Remove stale preview claims instead of inventing them.
    await prisma.menuItemDietaryTag.deleteMany({ where: { menuItemId: saved.id } });
    await prisma.menuItemAllergen.deleteMany({ where: { menuItemId: saved.id } });
  }

  await prisma.restaurantSettings.upsert({
    where: { key: "primary" },
    update: { restaurantName: "Georgiano", city: "North Hollywood", state: "California", timezone: "America/Los_Angeles" },
    create: {
      key: "primary",
      restaurantName: "Georgiano",
      city: "North Hollywood",
      state: "California",
      timezone: "America/Los_Angeles",
      orderingEnabled: false,
      reservationSettings: { create: { enabled: false } },
    },
  });

  const homepage = await prisma.homepageContent.upsert({
    where: { name: "primary" },
    update: { isPublished: true },
    create: { name: "primary", isPublished: true },
  });

  const homepageSections = [
    { key: "HERO" as const, eyebrow: "Georgiano · North Hollywood", headline: "Where Georgian tradition comes to the table.", supportingText: "Discover authentic Georgian flavors, timeless traditions, and the warmth of gathering around the table.", mediaUrl: "/media/hero-feast.png", mediaAlt: "A Georgian feast prepared for sharing", sortOrder: 10 },
    { key: "STORY" as const, eyebrow: "Our Story", headline: "Rooted in Tradition. Crafted for Today.", supportingText: "At Georgiano, the richness of Georgian cuisine meets a contemporary dining experience.", mediaUrl: "/media/khinkali-craft.png", mediaAlt: "Khinkali being prepared by hand", sortOrder: 20 },
    { key: "WINE" as const, eyebrow: "Georgian Wine", headline: "An Ancient Tradition. An Extraordinary Experience.", supportingText: "For thousands of years, wine has been part of Georgia’s language of welcome.", mediaUrl: "/media/qvevri-cellar.png", mediaAlt: "Traditional qvevri and amber wine in a candlelit cellar", sortOrder: 30 },
    { key: "EXPERIENCE" as const, eyebrow: "The Georgiano Experience", headline: "More Than a Dinner.", supportingText: "Generous cuisine, thoughtful wine, and the unmistakable warmth of Georgian hospitality.", mediaUrl: "/media/experience-hospitality.png", mediaAlt: "Guests sharing an evening in the Georgiano dining room", sortOrder: 40 },
    { key: "PRIVATE_DINING" as const, eyebrow: "Private Dining", headline: "Your Moments. Our Table.", supportingText: "Gather for celebrations and private occasions around a Georgian table.", mediaUrl: "/media/private-dining-table.png", mediaAlt: "A table set for a private gathering", sortOrder: 50 },
    { key: "CONTACT" as const, eyebrow: "Location & Contact", headline: "Visit Georgiano.", supportingText: "Join us for Georgian cuisine and hospitality in North Hollywood.", mediaUrl: "/media/visit-entrance.png", mediaAlt: "A warmly lit restaurant entrance", sortOrder: 60 },
  ];
  for (const section of homepageSections) {
    await prisma.homepageSection.upsert({
      where: { homepageContentId_key: { homepageContentId: homepage.id, key: section.key } },
      update: { isVisible: true, mediaType: "IMAGE", ...section },
      create: { homepageContentId: homepage.id, isVisible: true, mediaType: "IMAGE", ...section },
    });
  }

  const galleryImages = [
    ["/media/gallery-feast.png", "A Georgian table prepared for sharing", 10],
    ["/media/gallery-materials.png", "Georgiano material and table details", 20],
    ["/media/experience-hospitality.png", "Warm Georgian hospitality", 30],
  ] as const;

  for (const [imageUrl, altText, sortOrder] of galleryImages) {
    const existing = await prisma.galleryImage.findFirst({ where: { imageUrl } });
    if (existing) await prisma.galleryImage.update({ where: { id: existing.id }, data: { altText, sortOrder, isVisible: true, caption: null } });
    else await prisma.galleryImage.create({ data: { imageUrl, altText, sortOrder, isVisible: true } });
  }
}

seed()
  .then(() => console.info("Georgiano seed completed."))
  .catch((error) => { console.error("Georgiano seed failed.", error); process.exitCode = 1; })
  .finally(async () => prisma.$disconnect());
