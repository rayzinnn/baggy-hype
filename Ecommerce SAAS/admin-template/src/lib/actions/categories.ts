"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  if (!(await requireAdminSession())) return;

  const name = String(formData.get("name") || "").trim();
  const parentId = String(formData.get("parentId") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") || "0"), 10) || 0;
  if (!name) return;

  await prisma.category.create({
    data: { name, parentId, imageUrl, isFeatured, sortOrder },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/catalog");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  if (!(await requireAdminSession())) return;

  const name = String(formData.get("name") || "").trim();
  const parentId = String(formData.get("parentId") || "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") || "").trim() || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") || "0"), 10) || 0;
  if (!name) return;

  await prisma.category.update({
    where: { id: categoryId },
    data: { name, parentId, imageUrl, isFeatured, sortOrder },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/catalog");
}

export async function deleteCategory(categoryId: string) {
  if (!(await requireAdminSession())) return;

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/catalog");
}
