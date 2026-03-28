import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { name: "Oversized Tees" },
    update: {},
    create: { name: "Oversized Tees" },
  });

  await prisma.product.create({
    data: {
      name: "Camiseta Moletom Tribal Black",
      description: "Confeccionada em moletom heavyweight com modelagem drop shoulder.",
      price: 179.90,
      images: JSON.stringify(["/post01.jpg", "/post02.jpg"]),
      sizes: JSON.stringify(["P", "M", "G", "GG"]),
      categoryId: category.id,
      isFeatured: true,
    },
  });

  console.log("Seed complete: 1 Product added to Featured.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
