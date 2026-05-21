"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCustomer(customerId: string) {
  if (!(await requireAdminSession())) return;
  if (!customerId) return;

  await prisma.$transaction([
    prisma.order.updateMany({
      where: { customerId },
      data: { customerId: null },
    }),
    prisma.customer.delete({
      where: { id: customerId },
    }),
  ]);

  revalidatePath("/admin/customers");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
