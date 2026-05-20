import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL_FALLBACK = "https://jdffqusqshiecddczwpr.supabase.co";

export function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || SUPABASE_URL_FALLBACK;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabasePublicUrl(path: string, bucket = "product-media") {
  const url = process.env.SUPABASE_URL || SUPABASE_URL_FALLBACK;
  const cleanPath = path.replace(/^\/+/, "");
  return `${url}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

