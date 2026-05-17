"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user);
}

export async function createCategory(formData: FormData) {
  if (!(await requireAdmin())) return;

  const name = String(formData.get("name") || "").trim();
  const parentId = String(formData.get("parentId") || "").trim() || null;
  if (!name) return;

  await prisma.category.create({
    data: { name, parentId },
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(categoryId: string) {
  if (!(await requireAdmin())) return;

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
}
