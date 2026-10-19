-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "MenuItemStatus" AS ENUM ('AVAILABLE', 'SOLD_OUT', 'HIDDEN');

-- CreateEnum
CREATE TYPE "HomepageSectionKey" AS ENUM ('HERO', 'STORY', 'WINE', 'EXPERIENCE', 'PRIVATE_DINING', 'CONTACT');

-- CreateEnum
CREATE TYPE "HomepageBlockType" AS ENUM ('TEXT', 'FEATURE', 'QUOTE', 'MEDIA', 'CTA');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'DECLINED');

-- CreateEnum
CREATE TYPE "ContactInquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "categoryId" TEXT NOT NULL,
    "status" "MenuItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietaryTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "DietaryTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemDietaryTag" (
    "menuItemId" TEXT NOT NULL,
    "dietaryTagId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuItemDietaryTag_pkey" PRIMARY KEY ("menuItemId","dietaryTagId")
);

-- CreateTable
CREATE TABLE "MenuItemAllergen" (
    "menuItemId" TEXT NOT NULL,
    "allergenId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuItemAllergen_pkey" PRIMARY KEY ("menuItemId","allergenId")
);

-- CreateTable
CREATE TABLE "HomepageContent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'primary',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "HomepageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" TEXT NOT NULL,
    "homepageContentId" TEXT NOT NULL,
    "key" "HomepageSectionKey" NOT NULL,
    "eyebrow" TEXT,
    "headline" TEXT,
    "supportingText" TEXT,
    "mediaType" "MediaType",
    "mediaUrl" TEXT,
    "mediaAlt" TEXT,
    "primaryCtaLabel" TEXT,
    "primaryCtaHref" TEXT,
    "secondaryCtaLabel" TEXT,
    "secondaryCtaHref" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageBlock" (
    "id" TEXT NOT NULL,
    "homepageSectionId" TEXT NOT NULL,
    "type" "HomepageBlockType" NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT,
    "body" TEXT,
    "mediaUrl" TEXT,
    "mediaAlt" TEXT,
    "linkLabel" TEXT,
    "linkHref" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "HomepageBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'primary',
    "restaurantName" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/Los_Angeles',
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "directionsUrl" TEXT,
    "orderingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "RestaurantSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessServiceWindow" (
    "id" TEXT NOT NULL,
    "restaurantSettingsId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "label" TEXT,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "BusinessServiceWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialBusinessHours" (
    "id" TEXT NOT NULL,
    "restaurantSettingsId" TEXT NOT NULL,
    "localDate" DATE NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT,
    "startMinute" INTEGER,
    "endMinute" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SpecialBusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationSettings" (
    "id" TEXT NOT NULL,
    "restaurantSettingsId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "minimumLeadTimeMinutes" INTEGER,
    "maximumAdvanceDays" INTEGER,
    "maximumPartySize" INTEGER,
    "reservationIntervalMinutes" INTEGER,
    "defaultDurationMinutes" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ReservationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationServiceWindow" (
    "id" TEXT NOT NULL,
    "reservationSettingsId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "label" TEXT,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "slotIntervalMinutes" INTEGER,
    "defaultDurationMinutes" INTEGER,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ReservationServiceWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationClosure" (
    "id" TEXT NOT NULL,
    "reservationSettingsId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "startMinute" INTEGER,
    "endMinute" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ReservationClosure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationCapacityRule" (
    "id" TEXT NOT NULL,
    "reservationSettingsId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek",
    "startMinute" INTEGER,
    "endMinute" INTEGER,
    "maximumCovers" INTEGER NOT NULL,
    "effectiveFrom" DATE,
    "effectiveUntil" DATE,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ReservationCapacityRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "reservationAt" TIMESTAMPTZ(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Los_Angeles',
    "specialOccasion" TEXT,
    "specialRequests" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateDiningInquiry" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "preferredDate" DATE,
    "guestCount" INTEGER,
    "eventDetails" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PrivateDiningInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactInquiryStatus" NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "pickupAt" TIMESTAMPTZ(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Los_Angeles',
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "subtotalCents" INTEGER NOT NULL,
    "taxCents" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT,
    "itemNameSnapshot" TEXT NOT NULL,
    "itemPriceCentsSnapshot" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotalCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorIdentifier" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuCategory_slug_key" ON "MenuCategory"("slug");

-- CreateIndex
CREATE INDEX "MenuCategory_isVisible_sortOrder_idx" ON "MenuCategory"("isVisible", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_slug_key" ON "MenuItem"("slug");

-- CreateIndex
CREATE INDEX "MenuItem_categoryId_status_sortOrder_idx" ON "MenuItem"("categoryId", "status", "sortOrder");

-- CreateIndex
CREATE INDEX "MenuItem_featured_status_idx" ON "MenuItem"("featured", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DietaryTag_slug_key" ON "DietaryTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Allergen_slug_key" ON "Allergen"("slug");

-- CreateIndex
CREATE INDEX "MenuItemDietaryTag_dietaryTagId_idx" ON "MenuItemDietaryTag"("dietaryTagId");

-- CreateIndex
CREATE INDEX "MenuItemAllergen_allergenId_idx" ON "MenuItemAllergen"("allergenId");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageContent_name_key" ON "HomepageContent"("name");

-- CreateIndex
CREATE INDEX "HomepageSection_homepageContentId_isVisible_sortOrder_idx" ON "HomepageSection"("homepageContentId", "isVisible", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageSection_homepageContentId_key_key" ON "HomepageSection"("homepageContentId", "key");

-- CreateIndex
CREATE INDEX "HomepageBlock_homepageSectionId_isVisible_sortOrder_idx" ON "HomepageBlock"("homepageSectionId", "isVisible", "sortOrder");

-- CreateIndex
CREATE INDEX "GalleryImage_isVisible_sortOrder_idx" ON "GalleryImage"("isVisible", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantSettings_key_key" ON "RestaurantSettings"("key");

-- CreateIndex
CREATE INDEX "BusinessServiceWindow_restaurantSettingsId_dayOfWeek_sortOr_idx" ON "BusinessServiceWindow"("restaurantSettingsId", "dayOfWeek", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialBusinessHours_restaurantSettingsId_localDate_key" ON "SpecialBusinessHours"("restaurantSettingsId", "localDate");

-- CreateIndex
CREATE UNIQUE INDEX "ReservationSettings_restaurantSettingsId_key" ON "ReservationSettings"("restaurantSettingsId");

-- CreateIndex
CREATE INDEX "ReservationServiceWindow_reservationSettingsId_dayOfWeek_so_idx" ON "ReservationServiceWindow"("reservationSettingsId", "dayOfWeek", "sortOrder");

-- CreateIndex
CREATE INDEX "ReservationClosure_reservationSettingsId_startDate_endDate_idx" ON "ReservationClosure"("reservationSettingsId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "ReservationCapacityRule_reservationSettingsId_dayOfWeek_idx" ON "ReservationCapacityRule"("reservationSettingsId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "Reservation_reservationAt_status_idx" ON "Reservation"("reservationAt", "status");

-- CreateIndex
CREATE INDEX "Reservation_email_idx" ON "Reservation"("email");

-- CreateIndex
CREATE INDEX "PrivateDiningInquiry_status_createdAt_idx" ON "PrivateDiningInquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PrivateDiningInquiry_email_idx" ON "PrivateDiningInquiry"("email");

-- CreateIndex
CREATE INDEX "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactInquiry_email_idx" ON "ContactInquiry"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_pickupAt_status_idx" ON "Order"("pickupAt", "status");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_menuItemId_idx" ON "OrderItem"("menuItemId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_actorIdentifier_createdAt_idx" ON "AuditLog"("actorIdentifier", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemDietaryTag" ADD CONSTRAINT "MenuItemDietaryTag_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemDietaryTag" ADD CONSTRAINT "MenuItemDietaryTag_dietaryTagId_fkey" FOREIGN KEY ("dietaryTagId") REFERENCES "DietaryTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemAllergen" ADD CONSTRAINT "MenuItemAllergen_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemAllergen" ADD CONSTRAINT "MenuItemAllergen_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "Allergen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomepageSection" ADD CONSTRAINT "HomepageSection_homepageContentId_fkey" FOREIGN KEY ("homepageContentId") REFERENCES "HomepageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomepageBlock" ADD CONSTRAINT "HomepageBlock_homepageSectionId_fkey" FOREIGN KEY ("homepageSectionId") REFERENCES "HomepageSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessServiceWindow" ADD CONSTRAINT "BusinessServiceWindow_restaurantSettingsId_fkey" FOREIGN KEY ("restaurantSettingsId") REFERENCES "RestaurantSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialBusinessHours" ADD CONSTRAINT "SpecialBusinessHours_restaurantSettingsId_fkey" FOREIGN KEY ("restaurantSettingsId") REFERENCES "RestaurantSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationSettings" ADD CONSTRAINT "ReservationSettings_restaurantSettingsId_fkey" FOREIGN KEY ("restaurantSettingsId") REFERENCES "RestaurantSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationServiceWindow" ADD CONSTRAINT "ReservationServiceWindow_reservationSettingsId_fkey" FOREIGN KEY ("reservationSettingsId") REFERENCES "ReservationSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationClosure" ADD CONSTRAINT "ReservationClosure_reservationSettingsId_fkey" FOREIGN KEY ("reservationSettingsId") REFERENCES "ReservationSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationCapacityRule" ADD CONSTRAINT "ReservationCapacityRule_reservationSettingsId_fkey" FOREIGN KEY ("reservationSettingsId") REFERENCES "ReservationSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Domain integrity constraints not expressible in the Prisma schema.
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_priceCents_nonnegative" CHECK ("priceCents" >= 0);
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_partySize_positive" CHECK ("partySize" > 0);
ALTER TABLE "Order" ADD CONSTRAINT "Order_money_nonnegative" CHECK ("subtotalCents" >= 0 AND "taxCents" >= 0 AND "totalCents" >= 0);
ALTER TABLE "Order" ADD CONSTRAINT "Order_total_matches" CHECK ("totalCents" = "subtotalCents" + "taxCents");
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_values_valid" CHECK ("itemPriceCentsSnapshot" >= 0 AND "quantity" > 0 AND "lineTotalCents" = "itemPriceCentsSnapshot" * "quantity");
ALTER TABLE "BusinessServiceWindow" ADD CONSTRAINT "BusinessServiceWindow_minutes_valid" CHECK ("startMinute" >= 0 AND "startMinute" < 1440 AND "endMinute" > "startMinute" AND "endMinute" <= 1440);
ALTER TABLE "ReservationServiceWindow" ADD CONSTRAINT "ReservationServiceWindow_minutes_valid" CHECK ("startMinute" >= 0 AND "startMinute" < 1440 AND "endMinute" > "startMinute" AND "endMinute" <= 1440);
ALTER TABLE "SpecialBusinessHours" ADD CONSTRAINT "SpecialBusinessHours_minutes_valid" CHECK (("isClosed" = true AND "startMinute" IS NULL AND "endMinute" IS NULL) OR ("isClosed" = false AND "startMinute" >= 0 AND "startMinute" < 1440 AND "endMinute" > "startMinute" AND "endMinute" <= 1440));
