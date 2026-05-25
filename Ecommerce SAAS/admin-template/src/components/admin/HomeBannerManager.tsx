"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type BannerItem = {
  desktop: string;
  mobile: string;
  href: string;
};

type UploadResponse = {
  uploads: { signedUrl: string; publicUrl: string }[];
};

function cleanBanners(initial: BannerItem[]) {
  const banners = initial.filter((banner) => banner.desktop || banner.mobile || banner.href);
  return banners.length > 0 ? banners : [{ desktop: "", mobile: "", href: "/catalog" }];
}

async function uploadFile(file: File) {
  const signResponse = await fetch("/api/media/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      files: [{ filename: file.name, contentType: file.type, size: file.size, kind: "image" }],
    }),
  });
  if (!signResponse.ok) throw new Error("Falha ao iniciar upload.");
  const signed = (await signResponse.json()) as UploadResponse;
  const upload = signed.uploads[0];
  const put = await fetch(upload.signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!put.ok) throw new Error("Falha ao enviar arquivo.");
  return upload.publicUrl;
}

export function HomeBannerManager({ initialBanners }: { initialBanners: BannerItem[] }) {
  const [banners, setBanners] = useState<BannerItem[]>(() => cleanBanners(initialBanners).slice(0, 3));
  const [uploading, setUploading] = useState<string | null>(null);
  const normalized = useMemo(() => {
    const next = [...banners].slice(0, 3);
    while (next.length < 3) next.push({ desktop: "", mobile: "", href: "/catalog" });
    return next;
  }, [banners]);

  const updateBanner = (index: number, patch: Partial<BannerItem>) => {
    setBanners((current) => current.map((banner, bannerIndex) => (bannerIndex === index ? { ...banner, ...patch } : banner)));
  };

  const move = (index: number, direction: -1 | 1) => {
    setBanners((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const upload = async (index: number, type: "desktop" | "mobile", files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(`${index}-${type}`);
    try {
      const url = await uploadFile(file);
      updateBanner(index, { [type]: url });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao enviar banner.");
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {normalized.map((banner, index) => (
        <div key={index} className="rounded-3xl border border-white/10 bg-black/30 p-4">
          <input type="hidden" name={`heroImage${index + 1}`} value={banner.desktop} />
          <input type="hidden" name={`heroMobileImage${index + 1}`} value={banner.mobile} />
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Banner {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/30">Desktop 1920x760 px / Mobile 1080x1350 px</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-25" aria-label="Mover banner para cima">
                <ArrowUp size={14} />
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === banners.length - 1} className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-25" aria-label="Mover banner para baixo">
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => updateBanner(index, { desktop: "", mobile: "", href: "/catalog" })} className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/60 hover:bg-red-500 hover:text-white" aria-label="Limpar banner">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(["desktop", "mobile"] as const).map((type) => (
              <label key={type} className="group cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.03]">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    void upload(index, type, event.target.files);
                    event.target.value = "";
                  }}
                />
                <div className={`relative ${type === "desktop" ? "aspect-[16/6]" : "aspect-[4/5]"} bg-black`}>
                  {banner[type] ? (
                    <Image src={banner[type]} alt={`${type === "desktop" ? "Desktop" : "Mobile"} banner ${index + 1}`} fill sizes="420px" className="object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/35">
                      {uploading === `${index}-${type}` ? <Loader2 size={22} className="animate-spin" /> : <ImageIcon size={22} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{type === "desktop" ? "Enviar desktop" : "Enviar mobile"}</span>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>

          <label className="mt-3 flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">URL ao clicar neste banner</span>
            <input
              name={`heroLinkHref${index + 1}`}
              value={banner.href}
              onChange={(event) => updateBanner(index, { href: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-sm text-white outline-none transition-all focus:border-primary"
              placeholder="/catalog"
            />
          </label>
        </div>
      ))}
    </div>
  );
}
