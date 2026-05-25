import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight as ArrowRightIcon } from "lucide-react";
import { getFeaturedProducts, getSiteConfig } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getSiteConfig();
  const [featuredProducts, featuredCategories] = await Promise.all([
    getFeaturedProducts(),
    prisma.category.findMany({
      where: { isFeatured: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 8,
    }),
  ]);

  return (
    <div className="flex-1 w-full bg-black flex flex-col overflow-x-hidden selection:bg-primary/40 selection:text-white">
      <Navbar
        banner={{
          text: config?.topBannerText || "FRETE GRÁTIS EM PALMAS - TO / ENTREGA LOCAL",
          visible: config?.isBannerVisible ?? true,
        }}
      />

      <section className="relative min-h-[72vh] md:min-h-[82vh] overflow-hidden border-b border-white/10">
        <Link href={config?.heroLinkHref1 || config?.heroLinkHref || "/catalog"} className="absolute inset-0 block" aria-label="Abrir campanha principal">
          <Image
            src={config?.heroImage1 || "/post01.jpg"}
            alt="Banner principal Baggy Hype"
            fill
            sizes="100vw"
            priority
            className="hidden object-cover md:block"
          />
          <Image
            src={config?.heroMobileImage1 || config?.heroImage1 || "/post01.jpg"}
            alt="Banner principal Baggy Hype mobile"
            fill
            sizes="100vw"
            priority
            className="object-cover md:hidden"
          />
        </Link>
        <div className="pointer-events-none absolute bottom-8 left-4 z-10 md:left-14">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={config?.heroCtaHref || "/catalog"}
              className="pointer-events-auto px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 group border border-white"
            >
              {config?.heroCtaLabel || "Ver catálogo"}
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={config?.heroSecondaryHref || "/contact"}
              className="pointer-events-auto px-8 py-4 border border-white/30 bg-black/35 text-white font-black uppercase text-[10px] tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center backdrop-blur"
            >
              {config?.heroSecondaryLabel || "Falar no WhatsApp"}
            </Link>
          </div>
        </div>
      </section>

      {featuredCategories.length > 0 && (
        <section className="bg-white py-16 px-4 text-black md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-12">
            <h2 className="text-center text-xl font-black uppercase tracking-tight">Bora explorar na Baggy Hype?</h2>
            <div className="flex gap-8 overflow-x-auto pb-2 md:justify-center md:gap-16">
              {featuredCategories.map((category) => (
                <Link key={category.id} href={`/catalog?category=${category.id}`} className="group flex min-w-28 flex-col items-center gap-3">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-[3px] border-primary bg-neutral-200 shadow-lg transition-transform group-hover:scale-105">
                    <Image src={category.imageUrl || "/post01.jpg"} alt={category.name} fill sizes="112px" className="object-cover" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 border-y border-white/5 flex flex-col gap-12 overflow-hidden">
        <div className="flex animate-infinite-scroll whitespace-nowrap gap-8 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-8 items-center">
              <span className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-transparent border-text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">
                Baggy Hype
              </span>
              <span className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-primary">063 PALMAS</span>
              <span className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter text-white">OVERSIZED</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full" id="drops">
        <div className="flex items-end justify-between mb-14 overflow-hidden border-l-4 border-primary pl-4 md:mb-20 md:pl-6">
          <div className="flex flex-col gap-2">
            <h2 className="max-w-full text-[2.35rem] font-black uppercase italic tracking-tighter leading-[0.9] text-white sm:text-6xl md:text-8xl">
              Lançamentos <span className="block text-primary italic md:inline">em destaque</span>
            </h2>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">Vitrine / fit / conforto</p>
          </div>
          <Link
            href="/catalog"
            className="hidden md:block text-white text-[10px] font-black uppercase tracking-widest border-b border-primary pb-1 hover:text-primary transition-colors"
          >
            Ver vitrine
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-x-1 gap-y-16">
          {featuredProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-25">
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">Sem destaque no momento.</p>
            </div>
          ) : (
            featuredProducts.map((product) => {
              let images = ["/post01.jpg"];
              try {
                images = JSON.parse(product.images);
              } catch {}

              return (
                <Link href={`/product/${product.slug || product.id}`} key={product.id} className="group flex flex-col gap-4">
                  <div className="aspect-[3/4] bg-neutral-900 overflow-hidden relative border border-white/5">
                    <Image
                      src={images[0] || "/post01.jpg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute top-0 right-0 p-3 flex flex-col items-end gap-1">
                      <span className="bg-primary text-black font-black text-[8px] uppercase px-3 py-1 block shadow-lg">Destaque</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-px">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-[10px] md:text-xs uppercase tracking-tight text-white leading-tight pr-2 truncate">
                        {product.name}
                      </h3>
                      <span className="text-[10px] font-bold text-white/20">/063</span>
                    </div>
                    <p className="text-primary font-black text-xs md:text-sm italic tracking-tighter mt-1">R$ {(product.promoPrice || product.price).toString()}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section className="bg-primary py-12 px-8 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 text-[20vw] font-black uppercase text-black rotate-[-5deg] whitespace-nowrap select-none">
          PALMAS
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-black">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] text-center md:text-left">
            PALMAS - TO <br /> <span className="opacity-70">ENTREGA GRÁTIS</span>
          </h2>
          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <p className="text-[10px] font-black uppercase tracking-widest max-w-xs leading-relaxed">
              Pedido registrado no site. Suporte e fechamento direto no WhatsApp.
            </p>
            <Link href="/contact" className="bg-black text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer border border-black group">
              Falar no WhatsApp{" "}
              <ArrowRightIcon className="inline-block w-3 h-3 group-hover:translate-x-1 transition-transform ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

