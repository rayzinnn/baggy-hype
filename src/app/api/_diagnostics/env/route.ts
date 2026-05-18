import { NextResponse } from "next/server";

export async function GET() {
  const keys = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL",
    "NODE_ENV",
  ] as const;

  const present: Record<string, boolean> = {};
  for (const key of keys) present[key] = Boolean(process.env[key]);

  return NextResponse.json({ present });
}

