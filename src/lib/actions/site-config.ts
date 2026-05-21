"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { defaultStoreConfig } from "@/lib/store-config";
import { revalidatePath } from "next/cache";

export async function updateSiteConfig(formData: FormData) {
  if (!(await requireAdminSession())) return;

  const storeName = String(formData.get("storeName") || "").trim();
  const storeSlug = String(formData.get("storeSlug") || "").trim();
  const domain = String(formData.get("domain") || "").trim();
  const instagramUrl = String(formData.get("instagramUrl") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim().toUpperCase();
  const logoUrl = String(formData.get("logoUrl") || "").trim();
  const faviconUrl = String(formData.get("faviconUrl") || "").trim();
  const primaryColor = String(formData.get("primaryColor") || "").trim();
  const seoTitle = String(formData.get("seoTitle") || "").trim();
  const seoDescription = String(formData.get("seoDescription") || "").trim();
  const heroEyebrow = String(formData.get("heroEyebrow") || "").trim();
  const heroTitle = String(formData.get("heroTitle") || "").trim();
  const heroHighlight = String(formData.get("heroHighlight") || "").trim();
  const heroDescription = String(formData.get("heroDescription") || "").trim();
  const footerDescription = String(formData.get("footerDescription") || "").trim();
  const privacyText = String(formData.get("privacyText") || "").trim();
  const termsText = String(formData.get("termsText") || "").trim();
  const topBannerText = String(formData.get("topBannerText") || "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") || "").replace(/\D/g, "");
  const isBannerVisible = formData.get("isBannerVisible") === "on";
  const heroImage1 = String(formData.get("heroImage1") || "").trim();
  const heroImage2 = String(formData.get("heroImage2") || "").trim();
  const heroImage3 = String(formData.get("heroImage3") || "").trim();

  const data = {
    storeName: storeName || defaultStoreConfig.storeName,
    storeSlug: storeSlug || defaultStoreConfig.storeSlug,
    domain: domain || defaultStoreConfig.domain,
    instagramUrl,
    city: city || defaultStoreConfig.city,
    state: state || defaultStoreConfig.state,
    logoUrl,
    faviconUrl: faviconUrl || defaultStoreConfig.faviconUrl,
    primaryColor: primaryColor || defaultStoreConfig.primaryColor,
    seoTitle: seoTitle || defaultStoreConfig.seoTitle,
    seoDescription: seoDescription || defaultStoreConfig.seoDescription,
    heroEyebrow: heroEyebrow || defaultStoreConfig.heroEyebrow,
    heroTitle: heroTitle || defaultStoreConfig.heroTitle,
    heroHighlight: heroHighlight || defaultStoreConfig.heroHighlight,
    heroDescription: heroDescription || defaultStoreConfig.heroDescription,
    footerDescription: footerDescription || defaultStoreConfig.footerDescription,
    privacyText: privacyText || defaultStoreConfig.privacyText,
    termsText: termsText || defaultStoreConfig.termsText,
    topBannerText: topBannerText || defaultStoreConfig.topBannerText,
    whatsappNumber: whatsappNumber || defaultStoreConfig.whatsappNumber,
    isBannerVisible,
    heroImage1: heroImage1 || defaultStoreConfig.heroImage1,
    heroImage2: heroImage2 || defaultStoreConfig.heroImage2,
    heroImage3: heroImage3 || defaultStoreConfig.heroImage3,
  };

  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: data,
    create: {
      id: "singleton",
      ...data,
    },
  });

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/contact");
  revalidatePath("/terms");
  revalidatePath("/privacy");
  revalidatePath("/admin/settings");
}
