"use server";

import { adminAccessCookieName, adminRefreshCookieName, hasAdminAuthCookies } from "@/lib/admin-session";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL_FALLBACK = "https://jdffqusqshiecddczwpr.supabase.co";

export async function requireAdminSession() {
  const cookieStore = await cookies();
  if (!hasAdminAuthCookies(cookieStore)) return false;

  const access = cookieStore.get(adminAccessCookieName)?.value;
  const refresh = cookieStore.get(adminRefreshCookieName)?.value;
  if (!access || !refresh) return false;

  const url = process.env.SUPABASE_URL || SUPABASE_URL_FALLBACK;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!anonKey) return false;

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.auth.setSession({
    access_token: access,
    refresh_token: refresh,
  });
  if (error) return false;

  const { data } = await supabase.auth.getUser();
  return Boolean(data.user);
}
