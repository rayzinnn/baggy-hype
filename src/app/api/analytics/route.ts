import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VALID_EVENTS = new Set(["CART_ADD", "WHATSAPP_CHECKOUT"]);
const WINDOW_MS = 60_000;
const MAX_EVENTS_PER_WINDOW = 40;
const buckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_EVENTS_PER_WINDOW;
}

export async function POST(request: Request) {
  try {
    if (isRateLimited(getClientKey(request))) {
      return NextResponse.json({ error: "Muitas tentativas. Tente novamente em instantes." }, { status: 429 });
    }

    const body = (await request.json()) as {
      eventType?: unknown;
      productId?: unknown;
      metadata?: unknown;
    };
    const eventType = String(body.eventType || "");

    if (!VALID_EVENTS.has(eventType)) {
      return NextResponse.json({ error: "Evento invalido." }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        productId: typeof body.productId === "string" ? body.productId : null,
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ANALYTICS_EVENT_ERROR]", error);
    return NextResponse.json({ error: "Erro ao registrar evento." }, { status: 500 });
  }
}
