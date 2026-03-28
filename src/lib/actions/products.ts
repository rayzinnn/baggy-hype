"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  let success = false;
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const categoryName = formData.get("category") as string;
    const sizesInput = formData.get("sizes") as string;
    const imageInput = formData.get("images") as string;
    const isFeatured = formData.get("isFeatured") === "on";

    if (!name || !priceStr || !categoryName) {
      return { error: "Campos obrigatórios faltando." };
    }

    const price = parseFloat(priceStr.replace(",", "."));
    if (isNaN(price)) {
      return { error: "Preço inválido." };
    }

    // Buscar ou criar categoria
    let category = await prisma.category.findUnique({
      where: { name: categoryName }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName }
      });
    }

    // Sanitizar tamanhos e imagens
    const sizes = sizesInput ? sizesInput.split(",").map(s => s.trim().toUpperCase()) : [];
    const images = imageInput ? imageInput.split(",").map(i => i.trim()) : ["/post01.jpg"];

    console.log(`[PRODUCTS] Creating product: ${name}`);

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId: category.id,
        sizes: JSON.stringify(sizes),
        images: JSON.stringify(images),
        isFeatured,
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    success = true;
  } catch (error: any) {
    console.error("[PRODUCTS_ERROR]", error);
    return { error: error?.message || "Erro desconhecido ao cadastrar produto." };
  }

  if (success) {
    redirect("/admin/products");
  }
}
