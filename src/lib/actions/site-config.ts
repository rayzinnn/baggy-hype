"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSiteConfig(formData: FormData) {
  const topBannerText = formData.get("topBannerText") as string;
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const isBannerVisible = formData.get("isBannerVisible") === "on";
  const heroImage1 = formData.get("heroImage1") as string;
  const heroImage2 = formData.get("heroImage2") as string;
  const heroImage3 = formData.get("heroImage3") as string;

  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: {
      topBannerText,
      whatsappNumber,
      isBannerVisible,
      heroImage1: heroImage1 || undefined,
      heroImage2: heroImage2 || undefined,
      heroImage3: heroImage3 || undefined,
    },
    create: {
      id: "singleton",
      topBannerText: topBannerText || "🔥 FRETE GRÁTIS PARA PALMAS - TO | ENTREGA HOJE 🏁",
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
