ALTER TABLE "SiteConfig" ADD COLUMN "heroMobileImage1" TEXT NOT NULL DEFAULT '/post01.jpg';
ALTER TABLE "SiteConfig" ADD COLUMN "heroMobileImage2" TEXT NOT NULL DEFAULT '/post01.jpg';
ALTER TABLE "SiteConfig" ADD COLUMN "heroMobileImage3" TEXT NOT NULL DEFAULT '/post01.jpg';
ALTER TABLE "SiteConfig" ADD COLUMN "heroLinkHref1" TEXT NOT NULL DEFAULT '/catalog';
ALTER TABLE "SiteConfig" ADD COLUMN "heroLinkHref2" TEXT NOT NULL DEFAULT '/catalog';
ALTER TABLE "SiteConfig" ADD COLUMN "heroLinkHref3" TEXT NOT NULL DEFAULT '/catalog';

UPDATE "SiteConfig" SET "heroLinkHref1" = "heroLinkHref" WHERE "heroLinkHref1" = '/catalog';
UPDATE "SiteConfig" SET "topBannerText" = 'FRETE GRÁTIS EM PALMAS - TO / ENTREGA LOCAL' WHERE "topBannerText" = 'FRETE GRATIS EM PALMAS - TO / ENTREGA LOCAL';
UPDATE "SiteConfig" SET "heroCtaLabel" = 'Ver catálogo' WHERE "heroCtaLabel" = 'Ver catalogo';
