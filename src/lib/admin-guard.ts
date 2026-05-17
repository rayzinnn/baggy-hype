"use server";

import { auth } from "@/auth";
import { adminSessionCookieName, isValidAdminSessionToken } from "@/lib/admin-session";
import { cookies } from "next/headers";

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(adminSessionCookieName)?.value;

  if (isValidAdminSessionToken(sessionToken)) return true;

  const session = await auth().catch(() => null);
  return Boolean(session?.user);
}
