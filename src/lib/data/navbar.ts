import { prisma } from "@/lib/prisma";

export async function getNavbarData() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" }
  }) || {
    topBannerText: "🔥 FRETE GRÁTIS PARA PALMAS - TO | ENTREGA HOJE 🏁",
    isBannerVisible: true
  };

  return config;
}
