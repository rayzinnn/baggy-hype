ALTER TABLE "Category" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Category" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Category" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "SiteConfig" ADD COLUMN "heroCtaLabel" TEXT NOT NULL DEFAULT 'Ver catalogo';
ALTER TABLE "SiteConfig" ADD COLUMN "heroCtaHref" TEXT NOT NULL DEFAULT '/catalog';
ALTER TABLE "SiteConfig" ADD COLUMN "heroSecondaryLabel" TEXT NOT NULL DEFAULT 'Falar no WhatsApp';
ALTER TABLE "SiteConfig" ADD COLUMN "heroSecondaryHref" TEXT NOT NULL DEFAULT '/contact';
ALTER TABLE "SiteConfig" ADD COLUMN "heroLinkHref" TEXT NOT NULL DEFAULT '/catalog';
