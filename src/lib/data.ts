"use server";

import { prisma } from "./prisma";
import { defaultStoreConfig } from "./store-config";

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });
  } catch (error) {
    console.error("Prisma Error in getFeaturedProducts:", error);
    return [];
  }
}

export async function getSiteConfig() {
    try {
        const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
        return config || defaultStoreConfig;
    } catch (error) {
        console.error("Prisma Error in getSiteConfig:", error);
        return defaultStoreConfig;
    }
}
