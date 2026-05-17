"use server";

import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function money(value: FormDataEntryValue | null) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function integer(value: FormDataEntryValue | null) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function date(value: FormDataEntryValue | null, end = false) {
  const raw = String(value || "").trim();
  return raw ? new Date(`${raw}T${end ? "23:59:59.999" : "00:00:00"}`) : null;
}

export async function createCoupon(formData: FormData) {
  if (!(await requireAdminSession())) return;

  const code = String(formData.get("code") || "").trim().toUpperCase();
  const discountType = String(formData.get("discountType") || "PERCENT");
  const appliesTo = String(formData.get("appliesTo") || "STORE");
  if (!code) return;

  await prisma.coupon.create({
    data: {
      code,
      discountType,
      value: money(formData.get("value")) || 0,
      appliesTo,
      categoryId: appliesTo === "CATEGORY" ? String(formData.get("categoryId") || "") || null : null,
      productId: appliesTo === "PRODUCT" ? String(formData.get("productId") || "") || null : null,
      usageLimit: integer(formData.get("usageLimit")),
      perCustomerLimit: integer(formData.get("perCustomerLimit")),
      firstPurchaseOnly: formData.get("firstPurchaseOnly") === "on",
      startsAt: date(formData.get("startsAt")),
      endsAt: date(formData.get("endsAt"), true),
      minCartValue: money(formData.get("minCartValue")),
      maxDiscount: money(formData.get("maxDiscount")),
      includeShipping: formData.get("includeShipping") === "on",
      combinesWithPromos: formData.get("combinesWithPromos") === "on",
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(couponId: string) {
  if (!(await requireAdminSession())) return;

  await prisma.coupon.delete({ where: { id: couponId } });
  revalidatePath("/admin/coupons");
}
