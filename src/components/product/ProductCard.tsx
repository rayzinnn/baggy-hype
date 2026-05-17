import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string | null;
    price: { toString: () => string };
    promoPrice?: { toString: () => string } | null;
    images: string;
    category?: { name: string } | null;
    variants?: { stock: number }[];
  };
  badge?: string;
};

function parseJsonList(value: string, fallback: string[]) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : fallback;
  } catch {
    return fallback;
  }
}

function money(value: { toString: () => string }) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const images = parseJsonList(product.images, ["/post01.jpg"]);
  const href = `/product/${product.slug || product.id}`;
  const stock = product.variants?.reduce((sum, variant) => sum + variant.stock, 0);
  const hasPromo = Boolean(product.promoPrice);

  return (
    <Link href={href} className="group flex flex-col gap-4">
      <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-neutral-900">
        <Image
          src={images[0] || "/post01.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {badge && <span className="w-fit bg-primary px-3 py-1 text-[8px] font-black uppercase tracking-widest text-black">{badge}</span>}
          {stock === 0 && <span className="w-fit bg-red-500 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white">Esgotado</span>}
        </div>
        {product.category?.name && (
          <span className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white/70 backdrop-blur">
            {product.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-xs font-black uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <span className="shrink-0 text-[9px] font-black text-white/20">/063</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-black italic tracking-tighter text-primary">
            {money(product.promoPrice || product.price)}
          </span>
          {hasPromo && <span className="text-[10px] font-bold text-white/25 line-through">{money(product.price)}</span>}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">10x no cartao | checkout WhatsApp</span>
      </div>
    </Link>
  );
}
