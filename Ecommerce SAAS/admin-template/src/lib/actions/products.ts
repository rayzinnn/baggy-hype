"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProductActionState = {
  error?: string;
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function parseList(value: string, fallback: string[]) {
  const parsed = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
}

function parseMoney(value: string) {
  if (!value.trim()) return null;
  const normalized = value.includes(",") ? value.replace(/\./g, "").replace(",", ".") : value;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function syncProductMedia(productId: string, images: string[], videos: string[]) {
  await prisma.productMedia.deleteMany({
    where: {
      productId,
      variantId: null,
      type: { in: ["IMAGE", "VIDEO"] },
    },
  });

  const media = [
    ...images.map((url, index) => ({ type: "IMAGE" as const, url, sortOrder: index })),
    ...videos.map((url, index) => ({ type: "VIDEO" as const, url, sortOrder: index })),
  ];

  if (media.length === 0) return;
  await prisma.productMedia.createMany({
    data: media.map((item) => ({
      productId,
      type: item.type,
      url: item.url,
      sortOrder: item.sortOrder,
    })),
  });
}

async function requireAdmin() {
  return requireAdminSession();
}

function parseVariants(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [color = "", size = "", stock = "0", price = "", promoPrice = "", cost = "", media = ""] = line.split("|").map((item) => item.trim());
      return { color, size, stock, price, promoPrice, cost, media };
    })
    .filter((variant) => Object.values(variant).some((value) => value.trim()))
    .map((variant) => ({
      color: variant.color || "Unica",
      size: variant.size || "Unico",
      stock: Math.max(Number.parseInt(variant.stock, 10) || 0, 0),
      price: parseMoney(variant.price),
      promoPrice: parseMoney(variant.promoPrice),
      cost: parseMoney(variant.cost),
      media: JSON.stringify(parseList(variant.media, [])),
    }));
}

async function syncVariants(productId: string, variantsInput: string, fallbackPrice: number, fallbackCost: number | null, fallbackImages: string[]) {
  const variants = parseVariants(variantsInput);

  if (variants.length === 0) {
    variants.push({
      color: "Unica",
      size: "Unico",
      stock: 0,
      price: fallbackPrice,
      promoPrice: null,
      cost: fallbackCost,
      media: JSON.stringify(fallbackImages),
    });
  }

  await prisma.productVariant.deleteMany({ where: { productId } });
  await prisma.productVariant.createMany({
    data: variants.map((variant) => ({
      productId,
      color: variant.color,
      size: variant.size,
      stock: variant.stock,
      price: variant.price,
      promoPrice: variant.promoPrice,
      cost: variant.cost,
      media: variant.media,
    })),
  });
}

export async function createProduct(formData: FormData): Promise<ProductActionState | never> {
  if (!(await requireAdmin())) return { error: "Sessao admin invalida." };

  try {
    const name = getString(formData, "name");
    const description = getString(formData, "description");
    const price = parseMoney(getString(formData, "price"));
    const promoPrice = parseMoney(getString(formData, "promoPrice"));
    const cost = parseMoney(getString(formData, "cost"));
    const categoryId = getString(formData, "categoryId");
    const images = parseList(getString(formData, "images"), ["/post01.jpg"]);
    const videos = parseList(getString(formData, "videos"), []);
    const seoTitle = getString(formData, "seoTitle");
    const seoDescription = getString(formData, "seoDescription");
    const slug = getString(formData, "slug") || slugify(name);
    const isFeatured = formData.get("isFeatured") === "on";

    if (!name || price === null || !categoryId) return { error: "Campos obrigatorios faltando." };

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        promoPrice,
        cost,
        categoryId,
        images: JSON.stringify(images),
        videos: JSON.stringify(videos),
        sizes: "[]",
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isFeatured,
      },
    });

    await syncProductMedia(product.id, images, videos);
    await syncVariants(product.id, getString(formData, "variants"), price, cost, images);

    revalidatePath("/admin/products");
    revalidatePath("/");
  } catch (error) {
    console.error("[PRODUCTS_ERROR]", error);
    return { error: error instanceof Error ? error.message : "Erro desconhecido ao cadastrar produto." };
  }

  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData): Promise<ProductActionState | never> {
  if (!(await requireAdmin())) return { error: "Sessao admin invalida." };

  try {
    const name = getString(formData, "name");
    const description = getString(formData, "description");
    const price = parseMoney(getString(formData, "price"));
    const promoPrice = parseMoney(getString(formData, "promoPrice"));
    const cost = parseMoney(getString(formData, "cost"));
    const categoryId = getString(formData, "categoryId");
    const images = parseList(getString(formData, "images"), ["/post01.jpg"]);
    const videos = parseList(getString(formData, "videos"), []);
    const seoTitle = getString(formData, "seoTitle");
    const seoDescription = getString(formData, "seoDescription");
    const slug = getString(formData, "slug") || slugify(name);
    const isFeatured = formData.get("isFeatured") === "on";

    if (!name || price === null || !categoryId) return { error: "Campos obrigatorios faltando." };

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        description,
        price,
        promoPrice,
        cost,
        categoryId,
        images: JSON.stringify(images),
        videos: JSON.stringify(videos),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isFeatured,
      },
    });

    await syncProductMedia(productId, images, videos);
    await syncVariants(productId, getString(formData, "variants"), price, cost, images);

    revalidatePath("/admin/products");
    revalidatePath(`/product/${productId}`);
    revalidatePath("/");
  } catch (error) {
    console.error("[PRODUCTS_UPDATE_ERROR]", error);
    return { error: error instanceof Error ? error.message : "Erro desconhecido ao atualizar produto." };
  }

  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  if (!(await requireAdmin())) return;

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/admin/products");
  revalidatePath("/");
}
