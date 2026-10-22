import { Homepage, type HomepageData } from "@/components/home/homepage";
import { restaurantAddress, restaurantDirectionsUrl, restaurantEmail, restaurantHoursSummary, restaurantPhone } from "@/lib/restaurant-contact";

const galleryClasses = ["gallery__item--feast", "gallery__item--craft", "gallery__item--wine", "gallery__item--materials", "gallery__item--hospitality"];
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

async function loadHomepageData(): Promise<HomepageData | undefined> {
  const defaultSettings = {
    place: "North Hollywood, California",
    address: restaurantAddress,
    phone: restaurantPhone,
    email: restaurantEmail,
    hours: restaurantHoursSummary,
    directionsUrl: restaurantDirectionsUrl,
  };
  if (!process.env.DATABASE_URL) return { settings: defaultSettings };
  try {
    const [{ getPublishedHomepageContent, getPublicGallery }, { getRestaurantSettings }, { getPrisma }] = await Promise.all([import("@/lib/server/repositories/content-repository"), import("@/lib/server/repositories/settings-repository"), import("@/lib/server/database")]);
    const [content, gallery, settings, featured] = await Promise.all([getPublishedHomepageContent(), getPublicGallery(), getRestaurantSettings(), getPrisma().menuItem.findMany({ where: { featured: true, status: { not: "HIDDEN" } }, orderBy: { sortOrder: "asc" }, take: 4 })]);
    const sections = Object.fromEntries((content?.sections ?? []).map((section) => [section.key, { eyebrow: section.eyebrow, headline: section.headline, supportingText: section.supportingText, mediaUrl: section.mediaUrl, mediaAlt: section.mediaAlt }])) as HomepageData["sections"];
    return {
      sections,
      dishes: featured.filter((item) => item.imageUrl).map((item) => ({ name: item.name, description: item.description, price: item.priceCents == null ? "—" : usd.format(item.priceCents / 100), image: item.imageUrl!, position: "50% 50%" })),
      gallery: gallery.slice(0, 5).map((image, index) => ({ src: image.imageUrl, alt: image.altText, className: galleryClasses[index] })),
      settings: {
        place: [settings?.city, settings?.state].filter(Boolean).join(", ") || defaultSettings.place,
        address: defaultSettings.address,
        phone: defaultSettings.phone,
        email: defaultSettings.email,
        hours: defaultSettings.hours,
        directionsUrl: defaultSettings.directionsUrl,
      },
    };
  } catch (error) {
    console.error("Homepage database read failed; rendering approved fallback.", error instanceof Error ? error.message : "Unknown error");
    return { settings: defaultSettings };
  }
}

export default async function Home() {
  const data = await loadHomepageData();
  return <Homepage data={data} />;
}
