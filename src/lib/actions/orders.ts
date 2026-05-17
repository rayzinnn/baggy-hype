"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = new Set(["PENDING", "CONTACTED", "PAID", "DELIVERED", "CANCELED"]);

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

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
  const session = await auth();
  if (!session?.user) return;

  await prisma.order.delete({
    where: { id: orderId },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
