import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import AddToCartButton from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, CreditCard, Info, MapPin, Ruler, Smartphone, Star, Truck } from "lucide-react";

type ProductPageProps = {
  params: Promise<{ id: string }>;
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

async function getProduct(slugOrId: string) {
  return prisma.product.findFirst({
    where: { OR: [{ id: slugOrId }, { slug: slugOrId }] },
    include: {
      category: true,
      variants: { where: { isActive: true }, orderBy: [{ color: "asc" }, { size: "asc" }] },
    },
  });
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produto nao encontrado | Baggy Hype" };

  return {
    title: product.seoTitle || `${product.name} | Baggy Hype`,
    description: product.seoDescription || product.description || "Streetwear oversized em Palmas - TO. Pedido no site e fechamento no WhatsApp.",
    openGraph: {
      title: product.name,
      description: product.description || "Produto disponivel em Palmas - TO.",
      images: parseJsonList(product.images, ["/post01.jpg"]).slice(0, 1),
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });

  if (!product) return notFound();

  const images = parseJsonList(product.images, ["/post01.jpg"]);
  const videos = parseJsonList(product.videos, []);
  const waNumber = config?.whatsappNumber || "5563999999999";
  const salePrice = product.promoPrice || product.price;
  const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    include: { category: true, variants: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 4,
  });
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Salve Baggy Hype!\n\nVim pelo site e quero: *${product.name}*\nCodigo: ${product.slug || product.id}\nPreco: ${money(salePrice)}\n\nMe ajuda com tamanho e disponibilidade?`
  )}`;

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar banner={{ text: config?.topBannerText || "FRETE GRATIS PARA PALMAS - TO | ENTREGA HOJE", visible: config?.isBannerVisible ?? true }} />

      <main className="flex-1">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-[10px] font-black uppercase tracking-widest text-white/40 md:px-8">
          <Link href="/catalog" className="flex items-center gap-2 hover:text-white">
            <ArrowLeft size={12} /> Voltar ao catalogo
          </Link>
          <span>{product.category.name} / {product.slug || product.id.slice(0, 8)}</span>
        </div>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-20 md:grid-cols-[1.08fr_0.92fr] md:px-8">
          <ProductGallery images={images} name={product.name} />

          <div className="flex flex-col gap-8 md:sticky md:top-32 md:h-fit">
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Collection / {product.category.name}</p>
              <h1 className="max-w-xl text-5xl font-black uppercase italic leading-[0.88] tracking-tighter md:text-7xl">{product.name}</h1>
              <div className="grid grid-cols-1 gap-4 border-y border-white/10 py-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Preco</p>
                  <p className="text-4xl font-black italic tracking-tighter text-primary">{money(salePrice)}</p>
                  {product.promoPrice && <p className="text-xs font-bold text-white/25 line-through">{money(product.price)}</p>}
                </div>
                <div className="flex items-center gap-3 text-white/55">
                  <CreditCard size={22} className="text-primary" />
                  <p className="text-[10px] font-black uppercase leading-relaxed tracking-widest">Parcelamento e condicoes no atendimento</p>
                </div>
              </div>
            </div>

            <AddToCartButton product={{
              id: product.id,
              name: product.name,
              price: Number(salePrice),
              images: product.images,
              sizes: product.sizes,
              variants: product.variants.map((variant) => ({
                id: variant.id,
                color: variant.color,
                size: variant.size,
                stock: variant.stock,
                price: variant.price ? Number(variant.price) : null,
                promoPrice: variant.promoPrice ? Number(variant.promoPrice) : null,
                media: variant.media,
              })),
            }} />

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-4 border border-white/20 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:border-primary hover:text-primary"
            >
              <Smartphone className="h-4 w-4" />
              Duvidas de tamanho? Chama no WhatsApp
            </a>

            <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10">
              {[
                { icon: Truck, title: "Frete gratis", text: "Entrega em Palmas quando a campanha estiver ativa." },
                { icon: MapPin, title: "Retirada local", text: "Combine prova ou retirada pelo WhatsApp." },
                { icon: Ruler, title: "Modelagem", text: "Oversized, conforto amplo e caimento urbano." },
                { icon: BadgeCheck, title: "Estoque", text: stock > 0 ? `${stock} unidades disponiveis` : "Consulte reposicao" },
              ].map((item) => (
                <div key={item.title} className="bg-black p-5">
                  <item.icon className="mb-4 text-primary" size={18} />
                  <h2 className="text-[10px] font-black uppercase tracking-widest">{item.title}</h2>
                  <p className="mt-2 text-[9px] font-medium leading-relaxed text-white/35">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 border-t border-white/10 px-4 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8">
          <div>
            <h2 className="flex items-center gap-3 text-3xl font-black uppercase italic tracking-tighter">
              <Info className="text-primary" size={20} /> Caracteristicas
            </h2>
            <p className="mt-5 text-sm font-medium leading-loose text-white/50">
              {product.description || "Tecido confortável, caimento oversized e acabamento feito pra aguentar o corre."}
            </p>
          </div>
          <div className="grid gap-2 text-xs">
            {[
              ["Categoria", product.category.name],
              ["Modelagem", "Oversized"],
              ["Entrega", "Palmas - TO"],
              ["Checkout", "WhatsApp"],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[140px_1fr] bg-white/[0.04] px-4 py-3">
                <span className="font-black uppercase tracking-widest text-white/35">{label}</span>
                <span className="font-bold text-white/70">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {videos[0] && (
          <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
            <h2 className="mb-8 text-center text-3xl font-black uppercase italic tracking-tighter">Video do produto</h2>
            <div className="aspect-video overflow-hidden border border-white/10 bg-white/[0.03]">
              <iframe src={videos[0]} title={`Video ${product.name}`} className="h-full w-full" allowFullScreen />
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Produtos relacionados</h2>
              <Link href={`/catalog?category=${product.categoryId}`} className="text-[10px] font-black uppercase tracking-widest text-primary">Ver categoria</Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4">
              {relatedProducts.map((related) => <ProductCard key={related.id} product={related} badge="Relacionado" />)}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="grid gap-6 border border-white/10 bg-white/[0.03] p-8 md:grid-cols-[240px_1fr]">
            <div>
              <p className="text-6xl font-black italic tracking-tighter text-primary">5/5</p>
              <div className="mt-2 flex text-primary">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}</div>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Aprovado pela banca local</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                Avaliacao editorial inicial: caimento amplo, tecido confortavel e atendimento rapido pra acertar o tamanho antes de fechar no WhatsApp.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
