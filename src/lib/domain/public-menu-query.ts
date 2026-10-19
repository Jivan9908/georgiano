import type { Prisma } from "@/generated/prisma/client";

export const PUBLIC_MENU_QUERY = {
  where: { isVisible: true },
  orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  include: {
    items: {
      where: { status: { not: "HIDDEN" } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        dietaryTags: { include: { dietaryTag: true } },
        allergens: { include: { allergen: true } },
      },
    },
  },
} satisfies Prisma.MenuCategoryFindManyArgs;
