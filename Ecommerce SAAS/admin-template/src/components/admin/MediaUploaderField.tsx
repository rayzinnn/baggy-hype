"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Image as ImageIcon, Loader2, Plus, Trash2, Video } from "lucide-react";
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
}: {
  productId: string;
  name: string;
  label: string;
  initialValue?: string;
  accept: string;
  mediaType: "IMAGE" | "VIDEO";
  commitToDb?: boolean;
}) {
  const [items, setItems] = useState<MediaItem[]>(() => parseInitial(initialValue).filter((item) => item.type === mediaType));
  const [draft, setDraft] = useState("");
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
    if (!response.ok) throw new Error("Falha ao registrar midia.");
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

      setItems((current) => [...current, ...uploaded]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao enviar midia.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
        {isUploading && (
          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
            <Loader2 size={14} className="animate-spin" /> Enviando...
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Colar URL (opcional)"
          className="flex-1 bg-black/50 border border-white/10 rounded-2xl py-4 px-4 text-xs text-white outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={async () => {
            const url = draft.trim();
            if (!url) return;
            setDraft("");
            const nextOrder = items.length;
            try {
              const committed = await commit(url, nextOrder);
              setItems((current) => [...current, { id: committed?.media.id, url, type: mediaType }]);
            } catch {
              alert("Falha ao registrar midia.");
            }
          }}
          className="px-4 bg-white text-black rounded-2xl hover:bg-primary transition-all disabled:opacity-60"
          disabled={isUploading}
        >
          <Plus size={16} />
        </button>
        <label className="px-4 bg-white text-black rounded-2xl hover:bg-primary transition-all cursor-pointer inline-flex items-center justify-center disabled:opacity-60">
          <input
            type="file"
            accept={accept}
            multiple
            className="sr-only"
            onChange={(event) => {
              if (!event.target.files || event.target.files.length === 0) return;
              void uploadFiles(event.target.files);
              event.target.value = "";
            }}
            disabled={isUploading}
          />
          {mediaType === "IMAGE" ? <ImageIcon size={16} /> : <Video size={16} />}
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-[10px] font-bold uppercase tracking-widest text-white/25">
            Nenhuma midia adicionada.
          </div>
        ) : (
          items.map((item, index) => (
            <div key={`${item.url}-${index}`} className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {item.type === "IMAGE" ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                    <Image src={item.url} alt="Midia" fill sizes="48px" className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0 flex items-center justify-center text-white/40">
                    <Video size={18} />
                  </div>
                )}
                <span className="text-[10px] font-mono text-white/60 truncate">{index + 1}. {item.url}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => move(index, -1)} className="p-2 bg-white/5 rounded-lg"><ArrowUp size={12} /></button>
                <button type="button" onClick={() => move(index, 1)} className="p-2 bg-white/5 rounded-lg"><ArrowDown size={12} /></button>
                <button
                  type="button"
                  onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="p-2 bg-white/5 rounded-lg hover:bg-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
