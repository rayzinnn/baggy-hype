import { prisma } from "@/lib/prisma";

function parseJsonList(value: string, fallback: string[]) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : fallback;
  } catch {
    return fallback;
  }
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, images: true, videos: true, variants: { select: { id: true, media: true } } } });
  for (const product of products) {
    const images = parseJsonList(product.images, []);
    const videos = parseJsonList(product.videos, []);

    await prisma.productMedia.deleteMany({ where: { productId: product.id } });

    const mediaRows = [
      ...images.map((url, index) => ({ productId: product.id, variantId: null as string | null, type: "IMAGE" as const, url, sortOrder: index })),
      ...videos.map((url, index) => ({ productId: product.id, variantId: null as string | null, type: "VIDEO" as const, url, sortOrder: index })),
      ...product.variants.flatMap((variant) =>
        parseJsonList(variant.media, []).map((url, index) => ({ productId: product.id, variantId: variant.id, type: "IMAGE" as const, url, sortOrder: index }))
      ),
    ];

    if (mediaRows.length > 0) {
      await prisma.productMedia.createMany({ data: mediaRows });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

