import { NextResponse } from "next/server";
import {
  adminSessionCookieName,
  getAdminSessionToken,
  validateAdminCredentials,
} from "@/lib/admin-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookieName, getAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
