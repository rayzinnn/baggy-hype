"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Image as ImageIcon, Loader2, Plus, Trash2, Video } from "lucide-react";
import { useMemo, useState } from "react";

type VariantRow = {
  color: string;
  size: string;
  stock: string;
  price: string;
  promoPrice: string;
  cost: string;
  media: string;
};

function parseInitial(value: string): VariantRow[] {
  const rows = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [color = "", size = "", stock = "", price = "", promoPrice = "", cost = "", media = ""] = line.split("|").map((item) => item.trim());
      return { color, size, stock, price, promoPrice, cost, media };
    });

  return rows.length > 0 ? rows : [{ color: "", size: "", stock: "", price: "", promoPrice: "", cost: "", media: "" }];
}

function mediaItems(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm)(\?|$)/i.test(url) || /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

export function VariantEditor({ initialValue = "" }: { initialValue?: string }) {
  const [rows, setRows] = useState<VariantRow[]>(() => parseInitial(initialValue));
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const serialized = useMemo(
    () =>
      rows
        .filter((row) => Object.values(row).some((value) => value.trim()))
        .map((row) => `${row.color} | ${row.size} | ${row.stock} | ${row.price} | ${row.promoPrice} | ${row.cost} | ${row.media}`)
        .join("\n"),
    [rows]
  );

  const updateRow = (index: number, key: keyof VariantRow, value: string) => {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  };

  const updateMedia = (index: number, urls: string[]) => {
    updateRow(index, "media", urls.join(", "));
  };

  const moveMedia = (rowIndex: number, mediaIndex: number, direction: -1 | 1) => {
    setRows((current) =>
      current.map((row, index) => {
        if (index !== rowIndex) return row;
        const urls = mediaItems(row.media);
        const target = mediaIndex + direction;
        if (target < 0 || target >= urls.length) return row;
        [urls[mediaIndex], urls[target]] = [urls[target], urls[mediaIndex]];
        return { ...row, media: urls.join(", ") };
      })
    );
  };

  const move = (index: number, direction: -1 | 1) => {
    setRows((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const uploadVariantMedia = async (index: number, files: FileList) => {
    setUploadingIndex(index);
    try {
      const signResponse = await fetch("/api/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: [...files].map((file) => ({
            filename: file.name,
            contentType: file.type,
            size: file.size,
            kind: file.type.startsWith("video/") ? "video" : "image",
          })),
        }),
      });

      if (!signResponse.ok) throw new Error("Falha ao iniciar upload.");
      const signed = (await signResponse.json()) as { uploads: { signedUrl: string; publicUrl: string }[] };
      const uploaded: string[] = [];

      for (let fileIndex = 0; fileIndex < signed.uploads.length; fileIndex += 1) {
        const upload = signed.uploads[fileIndex];
        const file = files[fileIndex];
        const put = await fetch(upload.signedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!put.ok) throw new Error("Falha ao enviar arquivo.");
        uploaded.push(upload.publicUrl);
      }

      setRows((current) =>
        current.map((row, rowIndex) => {
          if (rowIndex !== index) return row;
          const currentMedia = row.media
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          return { ...row, media: [...currentMedia, ...uploaded].join(", ") };
        })
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao enviar mídia da variante.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const fields: { key: keyof VariantRow; label: string; placeholder: string; type?: string; className?: string }[] = [
    { key: "color", label: "Cor", placeholder: "Preto" },
    { key: "size", label: "Tamanho", placeholder: "G" },
    { key: "stock", label: "Estoque", placeholder: "0", type: "number" },
    { key: "price", label: "Preço", placeholder: "199.90", type: "number" },
    { key: "promoPrice", label: "Preço promo", placeholder: "179.90", type: "number" },
    { key: "cost", label: "Custo", placeholder: "80.00", type: "number" },
    { key: "media", label: "Mídias da variante", placeholder: "", className: "md:col-span-2 xl:col-span-3" },
  ];

  return (
    <div className="bg-surface p-5 sm:p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
      <input type="hidden" name="variants" value={serialized} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-black uppercase italic tracking-tighter">Variantes</h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Cor, tamanho, estoque e precificação por opção.</p>
        </div>
        <button type="button" onClick={() => setRows((current) => [...current, { color: "", size: "", stock: "0", price: "", promoPrice: "", cost: "", media: "" }])} className="px-4 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
          <Plus size={14} />
          Adicionar
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row, index) => (
          <div key={index} className="rounded-[1.5rem] border border-white/5 bg-black/20 p-4 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Variante {String(index + 1).padStart(2, "0")}</span>
                <span className="text-xs font-bold text-white/35">{row.color || "Cor"} / {row.size || "Tamanho"} / estoque {row.stock || "0"}</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => move(index, -1)} className="h-10 w-10 grid place-items-center bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-30" disabled={index === 0} aria-label="Mover variante para cima">
                  <ArrowUp size={14} />
                </button>
                <button type="button" onClick={() => move(index, 1)} className="h-10 w-10 grid place-items-center bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-30" disabled={index === rows.length - 1} aria-label="Mover variante para baixo">
                  <ArrowDown size={14} />
                </button>
                <button type="button" onClick={() => setRows((current) => (current.length === 1 ? [{ color: "", size: "", stock: "0", price: "", promoPrice: "", cost: "", media: "" }] : current.filter((_, rowIndex) => rowIndex !== index)))} className="h-10 w-10 grid place-items-center bg-white/5 rounded-xl hover:bg-red-500 hover:text-white" aria-label="Remover variante">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {fields.map((field) => (
                <label key={field.key} className={`flex flex-col gap-2 ${field.className || ""}`}>
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-primary">{field.label}</span>
                  {field.key === "media" ? (
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-3">
                      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-5 text-center transition-all hover:border-primary hover:bg-primary/10">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          className="sr-only"
                          onChange={(event) => {
                            if (!event.target.files || event.target.files.length === 0) return;
                            void uploadVariantMedia(index, event.target.files);
                            event.target.value = "";
                          }}
                          disabled={uploadingIndex !== null}
                        />
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-black">
                          {uploadingIndex === index ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/55">Enviar mídias</span>
                      </label>
                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {mediaItems(row.media).length === 0 ? (
                          <div className="col-span-full rounded-2xl border border-white/5 bg-black/40 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-white/25">
                            Nenhuma mídia da variante.
                          </div>
                        ) : (
                          mediaItems(row.media).map((url, mediaIndex, urls) => (
                            <div key={`${url}-${mediaIndex}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/60">
                              <div className="relative aspect-[4/5] bg-black">
                                {isVideoUrl(url) ? (
                                  <div className="flex h-full w-full items-center justify-center text-white/40">
                                    <Video size={26} />
                                  </div>
                                ) : (
                                  <Image src={url} alt={`Mídia da variante ${mediaIndex + 1}`} fill sizes="140px" className="object-cover" />
                                )}
                                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[9px] font-black text-black">
                                  {String(mediaIndex + 1).padStart(2, "0")}
                                </span>
                              </div>
                              <div className="flex justify-between gap-1 p-2">
                                <button type="button" onClick={() => moveMedia(index, mediaIndex, -1)} disabled={mediaIndex === 0} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 disabled:opacity-25">
                                  <ArrowUp size={12} />
                                </button>
                                <button type="button" onClick={() => moveMedia(index, mediaIndex, 1)} disabled={mediaIndex === urls.length - 1} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 disabled:opacity-25">
                                  <ArrowDown size={12} />
                                </button>
                                <button type="button" onClick={() => updateMedia(index, urls.filter((_, itemIndex) => itemIndex !== mediaIndex))} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-red-500 hover:text-white">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <input
                      value={row[field.key]}
                      type={field.type || "text"}
                      step={field.type === "number" ? "0.01" : undefined}
                      min={field.key === "stock" ? "0" : undefined}
                      placeholder={field.placeholder}
                      onChange={(event) => updateRow(index, field.key, event.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-primary placeholder:text-white/15"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
