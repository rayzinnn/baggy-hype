"use server";

import { prisma } from "./prisma";

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
        return await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    } catch (error) {
        console.error("Prisma Error in getSiteConfig:", error);
        return null;
    }
}
