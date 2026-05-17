"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = new Set(["PENDING", "CONTACTED", "PAID", "DELIVERED", "CANCELED"]);

export async function updateOrderStatus(orderId: string, formData: FormData) {
  if (!(await requireAdminSession())) return;

  const status = String(formData.get("status") || "");
  if (!VALID_STATUSES.has(status)) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}

export async function deleteOrder(orderId: string) {
  if (!(await requireAdminSession())) return;

  await prisma.order.delete({
    where: { id: orderId },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
