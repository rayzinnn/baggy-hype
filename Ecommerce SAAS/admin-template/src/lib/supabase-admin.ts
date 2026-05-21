import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabasePublicUrl(path: string, bucket = "product-media") {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("Missing SUPABASE_URL");
  const cleanPath = path.replace(/^\/+/, "");
  return `${url}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

