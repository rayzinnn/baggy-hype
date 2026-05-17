"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  if (!(await requireAdminSession())) return;

  const name = String(formData.get("name") || "").trim();
  const parentId = String(formData.get("parentId") || "").trim() || null;
  if (!name) return;

  await prisma.category.create({
    data: { name, parentId },
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(categoryId: string) {
  if (!(await requireAdminSession())) return;

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
}
