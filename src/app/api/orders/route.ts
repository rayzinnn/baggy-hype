import { prisma } from "@/lib/prisma";
import { defaultStoreConfig } from "@/lib/store-config";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CheckoutItemInput = {
  id?: unknown;
  variantId?: unknown;
  size?: unknown;
  color?: unknown;
  quantity?: unknown;
};

type CustomerInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  document?: unknown;
  address?: unknown;
};

type OrderLine = {
  productId: string;
  variantId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  categoryId: string;
  hasPromo: boolean;
};

class CheckoutError extends Error {
  status = 400;
}

function normalizeQuantity(value: unknown) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1) return null;
  return quantity;
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanPhone(value: string) {
  return value.replace(/\D/g, "");
}

async function getNextShortId(tx: Prisma.TransactionClient) {
  const lastOrder = await tx.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { shortId: true },
  });
  let nextNumber = Math.max(Number.parseInt(lastOrder?.shortId || "0", 10) || 0, await tx.order.count()) + 1;

  while (true) {
    const shortId = String(nextNumber).padStart(4, "0");
    const existing = await tx.order.findUnique({ where: { shortId } });
    if (!existing) return shortId;
    nextNumber += 1;
  }
}

function couponApplies(
  coupon: { appliesTo: string; productId: string | null; categoryId: string | null } | null,
  productIds: string[],
  categoryIds: string[]
) {
  if (!coupon) return false;
  if (coupon.appliesTo === "STORE") return true;
  if (coupon.appliesTo === "PRODUCT") return Boolean(coupon.productId && productIds.includes(coupon.productId));
  if (coupon.appliesTo === "CATEGORY") return Boolean(coupon.categoryId && categoryIds.includes(coupon.categoryId));
  return false;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: CheckoutItemInput[]; customer?: CustomerInput; couponCode?: unknown };
    const inputItems = Array.isArray(body.items) ? body.items : [];
    const customerInput = body.customer || {};

    if (inputItems.length === 0) return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });

    const customerName = text(customerInput.name);
    const customerPhone = cleanPhone(text(customerInput.phone));
    const customerEmail = text(customerInput.email);
    const customerDocument = text(customerInput.document);
    const customerAddress = text(customerInput.address);
    if (!customerName || !customerPhone || !customerDocument || !customerAddress) {
      return NextResponse.json({ error: "Preencha nome, telefone, documento e endereco." }, { status: 400 });
    }

    const couponCode = text(body.couponCode).toUpperCase();

    const result = await prisma.$transaction(async (tx) => {
      const productIds = [...new Set(inputItems.map((item) => text(item.id)).filter(Boolean))];
      const variantIds = [...new Set(inputItems.map((item) => text(item.variantId)).filter(Boolean))];
      const [products, variants] = await Promise.all([
        tx.product.findMany({ where: { id: { in: productIds } }, include: { category: true } }),
        tx.productVariant.findMany({ where: { id: { in: variantIds } } }),
      ]);
      const productsById = new Map(products.map((product) => [product.id, product]));
      const variantsById = new Map(variants.map((variant) => [variant.id, variant]));

      const items = inputItems.map((item) => {
        const productId = text(item.id);
        const product = productsById.get(productId);
        const variantId = text(item.variantId);
        const variant = variantId ? variantsById.get(variantId) : null;
        const quantity = normalizeQuantity(item.quantity);

        if (!product || quantity === null) return null;
        if (variantId && (!variant || variant.productId !== product.id || !variant.isActive)) return null;

        const price = Number(variant?.promoPrice || variant?.price || product.promoPrice || product.price);

        return {
          productId: product.id,
          variantId: variant?.id || "",
          name: product.name,
          color: variant?.color || text(item.color),
          size: variant?.size || text(item.size),
          price,
          quantity,
          categoryId: product.categoryId,
          hasPromo: Boolean(variant?.promoPrice || product.promoPrice),
        };
      });

      if (items.some((item) => item === null)) {
        throw new CheckoutError("Um ou mais itens do carrinho sao invalidos.");
      }

      const validItems = items.filter((item): item is OrderLine => item !== null);
      for (const item of validItems) {
        if (!item.variantId) continue;
        const update = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity }, isActive: true },
          data: { stock: { decrement: item.quantity } },
        });
        if (update.count !== 1) {
          throw new CheckoutError(`Estoque insuficiente para ${item.name}.`);
        }
      }

      const subtotal = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let discount = 0;

      if (couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
        const now = new Date();
        const usedByCoupon = await tx.order.count({ where: { couponCode } });
        const usedByCustomer = await tx.order.count({ where: { couponCode, customerPhone } });
        const customerPaidOrders = await tx.order.count({
          where: {
            customerPhone,
            status: { in: ["PAID", "DELIVERED"] },
          },
        });
        const productSet = validItems.map((item) => item.productId);
        const categorySet = validItems.map((item) => item.categoryId);
        const hasPromoItem = validItems.some((item) => item.hasPromo);
        const isValid =
          coupon?.isActive &&
          (!coupon.startsAt || coupon.startsAt <= now) &&
          (!coupon.endsAt || coupon.endsAt >= now) &&
          (!coupon.usageLimit || usedByCoupon < coupon.usageLimit) &&
          (!coupon.perCustomerLimit || usedByCustomer < coupon.perCustomerLimit) &&
          (!coupon.firstPurchaseOnly || customerPaidOrders === 0) &&
          (!coupon.minCartValue || subtotal >= Number(coupon.minCartValue)) &&
          (coupon.combinesWithPromos || !hasPromoItem) &&
          couponApplies(coupon, productSet, categorySet);

        if (!isValid) throw new CheckoutError("Cupom invalido para este carrinho.");

        if (coupon.discountType === "PERCENT") discount = subtotal * (Number(coupon.value) / 100);
        if (coupon.discountType === "FIXED") discount = Number(coupon.value);
        if (coupon.discountType === "FREE_SHIPPING") discount = 0;
        if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
        discount = Math.min(discount, subtotal);
      }

      const total = subtotal - discount;
      const shortId = await getNextShortId(tx);
      const customer = await tx.customer.upsert({
        where: { id: customerPhone },
        update: {
          name: customerName,
          email: customerEmail || null,
          phone: customerPhone,
          document: customerDocument,
          address: customerAddress,
        },
        create: {
          id: customerPhone,
          name: customerName,
          email: customerEmail || null,
          phone: customerPhone,
          document: customerDocument,
          address: customerAddress,
        },
      });

      const order = await tx.order.create({
        data: {
          shortId,
          customerId: customer.id,
          customerName,
          customerEmail: customerEmail || null,
          customerPhone,
          customerDocument,
          customerAddress,
          couponCode: couponCode || null,
          discount,
          subtotal,
          items: JSON.stringify(validItems),
          total,
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "WHATSAPP_CHECKOUT",
          metadata: JSON.stringify({ orderId: order.id, shortId: order.shortId, couponCode }),
        },
      });

      return { order, validItems, subtotal, discount, total };
    });

    const config = (await prisma.siteConfig.findUnique({ where: { id: "singleton" } })) || defaultStoreConfig;
    const whatsappNumber = config.whatsappNumber;
    const itemsSummary = result.validItems
      .map((item) => `- *${item.name}* (${item.color || "Cor N/A"} / ${item.size || "Tam N/A"}) - Qtd: ${item.quantity} @ R$ ${item.price.toFixed(2)}`)
      .join("\n");
    const message = encodeURIComponent(
      `Ola, ${config.storeName}!\n\nPedido #${result.order.shortId}\nCliente: ${customerName}\nTelefone: ${customerPhone}\nDocumento: ${customerDocument}\nEndereco: ${customerAddress}\n\n${itemsSummary}\n\nSubtotal: R$ ${result.subtotal.toFixed(2)}\nDesconto: R$ ${result.discount.toFixed(2)}\n*Total: R$ ${result.total.toFixed(2)}*\n\nComo prossigo com o pagamento?`
    );

    return NextResponse.json({
      orderId: result.order.id,
      shortId: result.order.shortId,
      whatsappUrl: `https://wa.me/${whatsappNumber}?text=${message}`,
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[ORDER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Erro ao registrar pedido." }, { status: 500 });
  }
}
