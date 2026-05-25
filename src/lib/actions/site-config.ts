"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSiteConfig(formData: FormData) {
  if (!(await requireAdminSession())) return;

  const topBannerText = String(formData.get("topBannerText") || "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") || "").replace(/\D/g, "");
  const isBannerVisible = formData.get("isBannerVisible") === "on";
  const heroImage1 = String(formData.get("heroImage1") || "").trim();
  const heroImage2 = String(formData.get("heroImage2") || "").trim();
  const heroImage3 = String(formData.get("heroImage3") || "").trim();
  const heroMobileImage1 = String(formData.get("heroMobileImage1") || "").trim();
  const heroMobileImage2 = String(formData.get("heroMobileImage2") || "").trim();
  const heroMobileImage3 = String(formData.get("heroMobileImage3") || "").trim();
  const heroLinkHref1 = String(formData.get("heroLinkHref1") || "").trim();
  const heroLinkHref2 = String(formData.get("heroLinkHref2") || "").trim();
  const heroLinkHref3 = String(formData.get("heroLinkHref3") || "").trim();
  const heroCtaLabel = String(formData.get("heroCtaLabel") || "").trim();
  const heroCtaHref = String(formData.get("heroCtaHref") || "").trim();
  const heroSecondaryLabel = String(formData.get("heroSecondaryLabel") || "").trim();
  const heroSecondaryHref = String(formData.get("heroSecondaryHref") || "").trim();
  const heroLinkHref = heroLinkHref1 || String(formData.get("heroLinkHref") || "").trim();

  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: {
      topBannerText,
      whatsappNumber: whatsappNumber || "5563999999999",
      isBannerVisible,
      heroImage1: heroImage1 || "/post01.jpg",
      heroImage2: heroImage2 || "/post01.jpg",
      heroImage3: heroImage3 || "/post01.jpg",
      heroMobileImage1: heroMobileImage1 || "/post01.jpg",
      heroMobileImage2: heroMobileImage2 || "/post01.jpg",
      heroMobileImage3: heroMobileImage3 || "/post01.jpg",
      heroLinkHref1: heroLinkHref1 || "/catalog",
      heroLinkHref2: heroLinkHref2 || "/catalog",
      heroLinkHref3: heroLinkHref3 || "/catalog",
      heroCtaLabel: heroCtaLabel || "Ver catálogo",
      heroCtaHref: heroCtaHref || "/catalog",
      heroSecondaryLabel: heroSecondaryLabel || "Falar no WhatsApp",
      heroSecondaryHref: heroSecondaryHref || "/contact",
      heroLinkHref: heroLinkHref || "/catalog",
    },
    create: {
      id: "singleton",
      topBannerText: topBannerText || "FRETE GRÁTIS EM PALMAS - TO / ENTREGA LOCAL",
      whatsappNumber: whatsappNumber || "5563999999999",
      isBannerVisible,
      heroImage1: heroImage1 || "/post01.jpg",
      heroImage2: heroImage2 || "/post01.jpg",
      heroImage3: heroImage3 || "/post01.jpg",
      heroMobileImage1: heroMobileImage1 || "/post01.jpg",
      heroMobileImage2: heroMobileImage2 || "/post01.jpg",
      heroMobileImage3: heroMobileImage3 || "/post01.jpg",
      heroLinkHref1: heroLinkHref1 || "/catalog",
      heroLinkHref2: heroLinkHref2 || "/catalog",
      heroLinkHref3: heroLinkHref3 || "/catalog",
      heroCtaLabel: heroCtaLabel || "Ver catálogo",
      heroCtaHref: heroCtaHref || "/catalog",
      heroSecondaryLabel: heroSecondaryLabel || "Falar no WhatsApp",
      heroSecondaryHref: heroSecondaryHref || "/contact",
      heroLinkHref: heroLinkHref || "/catalog",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
