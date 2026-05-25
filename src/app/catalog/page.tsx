import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";
import { Search, SlidersHorizontal, Truck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type CatalogSearchParams = {
  q?: string;
  category?: string;
  sort?: string;
};

export default async function CatalogPage({ searchParams }: { searchParams: Promise<CatalogSearchParams> }) {
  const params = await searchParams;
  const [config, categories] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: "singleton" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  const products = await prisma.product.findMany({
    where: {
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { description: { contains: params.q } },
              { slug: { contains: params.q } },
            ],
          }
        : {}),
      ...(params.category ? { categoryId: params.category } : {}),
    },
    include: { category: true, variants: true },
    orderBy:
      params.sort === "price"
        ? { price: "asc" }
        : params.sort === "new"
          ? { createdAt: "desc" }
          : [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar banner={{ text: config?.topBannerText || "FRETE GRATIS EM PALMAS - TO / ENTREGA LOCAL", visible: config?.isBannerVisible ?? true }} />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/10 px-4 py-16 md:px-8 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(247,209,23,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%)]" />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
            <div className="flex max-w-3xl flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Vitrine / Palmas - TO</span>
              <h1 className="text-6xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-9xl">
                Compre o <span className="text-primary">drip</span> pronto
              </h1>
              <p className="max-w-xl text-sm font-medium leading-relaxed text-white/45 md:text-base">
                Vitrine completa da Baggy Hype: oversized, fit certo e fechamento direto no WhatsApp.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 border border-white/10 bg-black/50 p-3 backdrop-blur md:grid-cols-[1fr_220px_180px_auto]">
              <form action="/catalog" className="contents">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                  <input name="q" defaultValue={params.q || ""} placeholder="Buscar peca, cor, tamanho..." className="h-14 w-full bg-white/5 pl-12 pr-4 text-xs font-bold uppercase tracking-widest text-white outline-none placeholder:text-white/25 focus:bg-white/10" />
                </div>
                <select name="category" defaultValue={params.category || ""} className="h-14 bg-white/5 px-4 text-xs font-bold uppercase tracking-widest text-white outline-none focus:bg-white/10">
                  <option value="">Todas categorias</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <select name="sort" defaultValue={params.sort || ""} className="h-14 bg-white/5 px-4 text-xs font-bold uppercase tracking-widest text-white outline-none focus:bg-white/10">
                  <option value="">Destaques</option>
                  <option value="new">Mais novos</option>
                  <option value="price">Menor preço</option>
                </select>
                <button className="flex h-14 items-center justify-center gap-2 bg-white px-6 text-[10px] font-black uppercase tracking-widest text-black transition-colors hover:bg-primary">
                  <SlidersHorizontal size={14} />
                  Filtrar
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-14 px-4 py-14 md:grid-cols-4 md:px-8">
          {products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-4 border border-white/10 bg-white/[0.03] p-12 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Nenhum produto encontrado.</p>
              <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-primary">Limpar filtros</Link>
            </div>
          ) : (
            products.map((product) => <ProductCard key={product.id} product={product} badge={product.isFeatured ? "Drop" : undefined} />)
          )}
        </section>

        <section className="border-y border-white/10 bg-primary px-4 py-10 text-black md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-4">
              <Truck size={28} />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter md:text-5xl">Frete grátis em Palmas</h2>
            </div>
            <p className="max-w-sm text-[10px] font-black uppercase leading-relaxed tracking-widest">Registrou no site, fechou no WhatsApp e recebeu no corre local.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
