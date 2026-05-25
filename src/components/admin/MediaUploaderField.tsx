"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Image as ImageIcon, Loader2, Trash2, Video } from "lucide-react";
import { useMemo, useState } from "react";

type MediaItem = {
  id?: string;
  url: string;
  type: "IMAGE" | "VIDEO";
};

type SignResponse = {
  uploads: { path: string; signedUrl: string; publicUrl: string }[];
};

type CommitResponse = {
  media: { id: string; url: string; type: "IMAGE" | "VIDEO"; sortOrder: number };
};

function parseInitial(initialValue: string) {
  const items = initialValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((url) => {
      const isVideo = /\.(mp4|mov|webm)(\?|$)/i.test(url) || /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
      return { url, type: isVideo ? ("VIDEO" as const) : ("IMAGE" as const) };
    });

  return items.length > 0 ? items : [];
}

export function MediaUploaderField({
  productId,
  name,
  label,
  initialValue = "",
  accept,
  mediaType,
  commitToDb = true,
  multiple = true,
  helperText,
}: {
  productId: string;
  name: string;
  label: string;
  initialValue?: string;
  accept: string;
  mediaType: "IMAGE" | "VIDEO";
  commitToDb?: boolean;
  multiple?: boolean;
  helperText?: string;
}) {
  const [items, setItems] = useState<MediaItem[]>(() => parseInitial(initialValue).filter((item) => item.type === mediaType));
  const [isUploading, setIsUploading] = useState(false);
  const value = useMemo(() => items.map((item) => item.url).join(", "), [items]);

  const move = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const commit = async (url: string, sortOrder: number) => {
    if (!commitToDb) return null;
    const response = await fetch("/api/media/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, url, type: mediaType, sortOrder }),
    });
    if (!response.ok) throw new Error("Falha ao registrar mídia.");
    return (await response.json()) as CommitResponse;
  };

  const uploadFiles = async (files: FileList) => {
    setIsUploading(true);
    try {
      const signResponse = await fetch("/api/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: [...files].map((file) => ({
            filename: file.name,
            contentType: file.type,
            size: file.size,
            kind: mediaType === "IMAGE" ? "image" : "video",
          })),
        }),
      });

      if (!signResponse.ok) throw new Error("Falha ao iniciar upload.");
      const signed = (await signResponse.json()) as SignResponse;

      const uploaded: MediaItem[] = [];
      for (let index = 0; index < signed.uploads.length; index += 1) {
        const upload = signed.uploads[index];
        const file = files[index];
        const put = await fetch(upload.signedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!put.ok) throw new Error("Falha ao enviar arquivo.");

        const nextOrder = items.length + uploaded.length;
        const committed = await commit(upload.publicUrl, nextOrder);
        uploaded.push({ id: committed?.media.id, url: upload.publicUrl, type: mediaType });
      }

      setItems((current) => (multiple ? [...current, ...uploaded] : uploaded.slice(0, 1)));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao enviar mídia.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={value} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</span>
          {helperText && <span className="text-[9px] font-bold uppercase tracking-widest text-white/25">{helperText}</span>}
        </div>
        {isUploading && (
          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
            <Loader2 size={14} className="animate-spin" /> Enviando...
          </span>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 p-3">
        <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-6 text-center transition-all hover:border-primary hover:bg-primary/10">
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            className="sr-only"
            onChange={(event) => {
              if (!event.target.files || event.target.files.length === 0) return;
              void uploadFiles(event.target.files);
              event.target.value = "";
            }}
            disabled={isUploading}
          />
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-black">
            {isUploading ? <Loader2 size={17} className="animate-spin" /> : mediaType === "IMAGE" ? <ImageIcon size={17} /> : <Video size={17} />}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/55">
            {multiple ? "Enviar mídias" : "Enviar mídia"}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/25">
            {mediaType === "IMAGE" ? "Imagens" : "Vídeos"} via upload, sem URL manual
          </span>
        </label>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/5 bg-black/40 p-5 text-center text-[10px] font-bold uppercase tracking-widest text-white/25">
              Nenhuma mídia adicionada.
            </div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.url}-${index}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                <div className="relative aspect-[4/5] bg-black">
                  {item.type === "IMAGE" ? (
                    <Image src={item.url} alt={`Mídia ${index + 1}`} fill sizes="160px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/40">
                      <Video size={28} />
                    </div>
                  )}
                  <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[9px] font-black text-black">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-1 p-2">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-white/60 transition-all hover:bg-white/10 disabled:opacity-25" aria-label="Mover mídia para cima">
                    <ArrowUp size={13} />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-white/60 transition-all hover:bg-white/10 disabled:opacity-25" aria-label="Mover mídia para baixo">
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-white/60 transition-all hover:bg-red-500 hover:text-white"
                    aria-label="Remover mídia"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
