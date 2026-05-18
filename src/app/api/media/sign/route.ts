import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-guard";
import { getSupabaseAdminClient, getSupabasePublicUrl } from "@/lib/supabase-admin";

type FileInput = {
  filename?: unknown;
  contentType?: unknown;
  size?: unknown;
  kind?: unknown;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function safeExt(filename: string) {
  const match = filename.toLowerCase().match(/\.([a-z0-9]{1,8})$/);
  return match ? match[1] : "bin";
}

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { files?: FileInput[] };
    const files = Array.isArray(body.files) ? body.files : [];
    if (files.length === 0) return NextResponse.json({ error: "No files provided" }, { status: 400 });

    const supabase = getSupabaseAdminClient();
    const bucket = process.env.SUPABASE_MEDIA_BUCKET || "product-media";
    const now = new Date();
    const dateKey = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;

    const uploads = [];
    for (const file of files) {
      const filename = text(file.filename) || "upload.bin";
      const kind = text(file.kind) || "image";
      const ext = safeExt(filename);
      const path = `${dateKey}/${kind}/${crypto.randomUUID()}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
      if (error || !data?.signedUrl) {
        return NextResponse.json({ error: error?.message || "Failed to sign upload" }, { status: 500 });
      }

      uploads.push({
        path,
        signedUrl: data.signedUrl,
        publicUrl: getSupabasePublicUrl(path, bucket),
      });
    }

    return NextResponse.json({ uploads });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

