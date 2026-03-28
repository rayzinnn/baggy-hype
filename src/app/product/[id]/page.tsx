import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  Smartphone,
  Info
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true }
  });

  const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });

  if (!product) return notFound();

  const images = JSON.parse(product.images);
  const waNumber = config?.whatsappNumber || "5563999999999";
  
  // Link dinâmico do WhatsApp (Fallback imediato)
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Salve Baggy Hype! \n\nVim pelo site e quero o produto: *${product.name}*\nID: ${product.id}\nPreço: R$ ${product.price.toString()}\n\nQual a disponibilidade para o tamanho [INSIRA SEU TAMANHO]?`
  )}`;

  return (
    <div className="flex-1 w-full bg-black flex flex-col overflow-x-hidden selection:bg-orange-500/30">
      <Navbar banner={{ 
        text: config?.topBannerText || "🔥 FRETE GRÁTIS PARA PALMAS - TO | ENTREGA HOJE 🏁", 
        visible: config?.isBannerVisible ?? true 
      }} />
      
      {/* Breadcrumbs & Back */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
        <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Voltar ao Catálogo
        </Link>
        <span>{product.category.name} / {product.id.slice(0, 8)}</span>
      </div>

      {/* Main Product Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-16 min-h-[90vh]">
        
        {/* Left: Product Images Stack */}
        <div className="flex-1 flex flex-col gap-4 order-1">
            <div className="relative aspect-[4/5] bg-neutral-900 border border-white/10 group overflow-hidden">
                <Image 
                    src={images[0] || "/post01.jpg"} 
                    alt={product.name} 
                    fill 
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                />
                <div className="absolute top-8 right-0 -translate-y-1/2 flex flex-col items-end gap-2 z-10">
                   <span className="bg-primary text-black font-black text-[9px] uppercase px-4 py-2 rotate-[5deg] shadow-2xl tracking-tighter italic">
                       Palmas 🏁 063 LOCAL
                   </span>
                </div>
            </div>
            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-2 gap-4">
               {images.slice(1, 4).map((img: string, i: number) => (
                  <div key={i} className="aspect-square bg-white/5 border border-white/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden group relative">
                     <Image src={img} alt={`Thumb ${i}`} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
               ))}
            </div>
        </div>

        {/* Right: Content */}
        <div className="flex-[0.8] flex flex-col gap-8 order-2 sticky top-32 h-fit">
            <div className="flex flex-col gap-3">
                <p className="text-primary font-black uppercase text-[10px] md:text-xs tracking-[0.5em] italic">
                   Collection / {product.category.name}
                </p>
                <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white max-w-sm">
                   {product.name}
                </h1>
                <div className="flex items-end gap-4 mt-2">
                    <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">
                        R$ {product.price.toString()}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 pb-2">Ou 3x no Cartão</span>
                </div>
            </div>

            {/* Carrinho & Checkout (CLIENT COMPONENT) */}
            <AddToCartButton product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                images: product.images,
                sizes: product.sizes
            }} />

            {/* Secondary CTA: WHATSAPP */}
            <div className="flex flex-col gap-4">
                <a 
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full md:w-auto px-8 py-4 border border-white/20 text-white font-black uppercase text-[10px] tracking-widest hover:border-white transition-all flex items-center justify-center gap-4 hover:scale-[1.02] shadow-2xl active:scale-100"
                >
                    <Smartphone className="w-4 h-4 text-primary" />
                    Dúvidas sobre o fit? WhatsApp
                </a>
                <div className="flex items-center gap-2 justify-center py-2 opacity-50">
                    <Truck size={12} className="text-white" />
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white">Entrega hoje em Palmas (TO)</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-px bg-white/5 mt-8 border border-white/5">
                <div className="flex flex-col gap-3 p-6 bg-black">
                    <Truck size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest italic">Frete Grátis</span>
                    <p className="text-[9px] text-white/30 lowercase font-medium leading-relaxed">Campanha 2026: Entrega 100% gratuita para toda capital Palmas.</p>
                </div>
                <div className="flex flex-col gap-3 p-6 bg-black">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest italic">Pick-up 🏁 Local</span>
                    <p className="text-[9px] text-white/30 lowercase font-medium leading-relaxed">Logística própria. Seu drop chega em horas, não dias.</p>
                </div>
            </div>

            {/* Detailed Description */}
            <div className="flex flex-col gap-6 mt-12 py-12 border-t border-white/5">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
                    <Info size={16} className="text-primary" /> Manifesto
                </h3>
                <div className="flex flex-col gap-4 text-xs md:text-sm text-white/50 leading-loose italic font-medium max-w-lg">
                    {product.description || "Fragmento da alma urbana. Conforto e atitude em cada fibra."}
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
