import "server-only";
import { getPrisma } from "../database";
import { executeDatabaseOperation } from "../data-access-error";

export function getPublishedHomepageContent() {
  return executeDatabaseOperation("homepage.public.read", () => getPrisma().homepageContent.findFirst({
    where: { isPublished: true },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
        include: { blocks: { where: { isVisible: true }, orderBy: { sortOrder: "asc" } } },
      },
    },
  }));
}

export function getPublicGallery() {
  return executeDatabaseOperation("gallery.public.read", () => getPrisma().galleryImage.findMany({
    where: { isVisible: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  }));
}
