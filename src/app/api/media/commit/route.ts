import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type CommitInput = {
  productId?: unknown;
  variantId?: unknown;
  type?: unknown;
  url?: unknown;
  sortOrder?: unknown;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CommitInput;
    const productId = text(body.productId);
    const variantIdRaw = text(body.variantId);
    const url = text(body.url);
    const type = text(body.type).toUpperCase();
    const sortOrder = Number(body.sortOrder);

    if (!productId || !url) return NextResponse.json({ error: "Missing productId or url" }, { status: 400 });
    if (type !== "IMAGE" && type !== "VIDEO") return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const media = await prisma.productMedia.create({
      data: {
        productId,
        variantId: variantIdRaw || null,
        type: type as "IMAGE" | "VIDEO",
        url,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      },
    });

    return NextResponse.json({ media });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

