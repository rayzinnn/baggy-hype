"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const safeImages = images.length > 0 ? images : ["/post01.jpg"];
  const [active, setActive] = useState(safeImages[0]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(image)}
            className={`relative h-24 w-20 shrink-0 overflow-hidden border bg-neutral-900 transition-all md:w-full ${
              active === image ? "border-primary" : "border-white/10 opacity-60 hover:opacity-100"
            }`}
            aria-label={`Ver imagem ${index + 1}`}
          >
            <Image src={image} alt={`${name} imagem ${index + 1}`} fill sizes="88px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-[4/5] overflow-hidden border border-white/10 bg-neutral-900 md:order-2">
        <Image
          src={active}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 48vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <span className="absolute bottom-4 right-4 bg-black px-4 py-2 text-[9px] font-black uppercase tracking-widest text-primary">
          Produto
        </span>
      </div>
    </div>
  );
}
