"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = new Set(["PENDING", "CONTACTED", "PAID", "DELIVERED", "CANCELED"]);
const CUSTOMER_STATUSES = new Set(["PAID", "DELIVERED"]);

export async function updateOrderStatus(orderId: string, formData: FormData) {
  if (!(await requireAdminSession())) return;

  const status = String(formData.get("status") || "");
  if (!VALID_STATUSES.has(status)) return;

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) return;

    let customerId = order.customerId;
    if (CUSTOMER_STATUSES.has(status) && order.customerPhone) {
      const customerName = order.customerName || "Cliente sem nome";
      const customer = await tx.customer.upsert({
        where: { id: order.customerPhone },
        update: {
          name: customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          document: order.customerDocument,
          address: order.customerAddress,
        },
        create: {
          id: order.customerPhone,
          name: customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          document: order.customerDocument,
          address: order.customerAddress,
        },
      });
      customerId = customer.id;
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status, customerId },
    });
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/customers");
}

export async function deleteOrder(orderId: string) {
  if (!(await requireAdminSession())) return;

  await prisma.order.delete({
    where: { id: orderId },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
