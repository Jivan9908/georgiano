-- One photographed source item has a deliberately unlisted price. Keeping the
-- database nullable preserves the source without inventing customer-facing data.
ALTER TABLE "MenuItem" ALTER COLUMN "priceCents" DROP NOT NULL;
