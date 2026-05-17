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

  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: {
      topBannerText,
      whatsappNumber: whatsappNumber || "5563999999999",
      isBannerVisible,
      heroImage1: heroImage1 || undefined,
      heroImage2: heroImage2 || undefined,
      heroImage3: heroImage3 || undefined,
    },
    create: {
      id: "singleton",
      topBannerText: topBannerText || "FRETE GRATIS PARA PALMAS - TO | ENTREGA HOJE",
      whatsappNumber: whatsappNumber || "5563999999999",
      isBannerVisible,
      heroImage1: heroImage1 || "/post01.jpg",
      heroImage2: heroImage2 || "/post01.jpg",
      heroImage3: heroImage3 || "/post01.jpg",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
