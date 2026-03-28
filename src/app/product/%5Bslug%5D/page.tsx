import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  RotateCcw, 
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for UI/UX Phase
const getProduct = (slug: string) => ({
  id: "baggy-drop-01",
  name: "Camiseta Moletom Oversized Tribal Black",
  price: "179,90",
  oldPrice: "229,90",
  description: [
    "Confeccionada em moletom heavyweight (fio 30/1 penteado) com gramatura superior.",
    "Modelagem drop shoulder oversized para caimento perfeito e conforto absoluto.",
    "Estampa tribal exclusiva silkada no peito e costas com alta definição.",
    "Ideal para o clima de Palmas: tecido que respira e mantém o estilo no calor do cerrado."
  ],
  sizes: ["P", "M", "G", "GG", "XG"],
  images: ["/post01.jpg", "/post02.jpg"],
  category: "Oversized Tees",
  sku: "BGY-TRBL-BK-001"
});

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);

  return (
    <div className="flex-1 w-full bg-black flex flex-col overflow-x-hidden selection:bg-primary/40 selection:text-white">
      <Navbar />
      
      {/* Breadcrumbs & Back */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
        <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Voltar ao Catálogo
        </Link>
        <span>{product.category} / {product.sku}</span>
      </div>

      {/* Main Product Section (90/10 Split / Asymmetric) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-16 min-h-[90vh]">
        
        {/* Left: Product Images Stack (High Contrast) */}
        <div className="flex-1 flex flex-col gap-4 order-1">
            <div className="relative aspect-[4/5] bg-neutral-900 border border-white/10 group overflow-hidden">
                <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    fill 
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                />
                <div className="absolute top-8 right-0 -translate-y-1/2 flex flex-col items-end gap-2 z-10">
                   <span className="bg-primary text-black font-black text-[9px] uppercase px-4 py-2 rotate-[5deg] shadow-2xl">
                       Palmas 🏁 Exclusive
                   </span>
                   <span className="bg-white text-black font-black text-[9px] uppercase px-3 py-1.5 -translate-x-4 border border-black shadow-xl">
                       New Drop 26
                   </span>
                </div>
            </div>
            {/* Gallery Thumbnails (Brutalist Style) */}
            <div className="grid grid-cols-2 gap-4">
               {product.images.map((img, i) => (
                  <div key={i} className="aspect-square bg-white/5 border border-white/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden group">
                     <Image src={img} alt={`Thumb ${i}`} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
               ))}
            </div>
        </div>

        {/* Right: Content (Minimalist & Heavy) */}
        <div className="flex-[0.8] flex flex-col gap-8 order-2 sticky top-32 h-fit">
            <div className="flex flex-col gap-3">
                <p className="text-primary font-black uppercase text-[10px] md:text-xs tracking-[0.5em] italic">
                   Collection / Organic Drip
                </p>
                <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white max-w-sm">
                   {product.name}
                </h1>
                <div className="flex items-end gap-4 mt-2">
                    <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">
                        R$ {product.price}
                    </span>
                    <span className="text-lg text-white/20 font-bold line-through mb-1">
                        R$ {product.oldPrice}
                    </span>
                </div>
            </div>

            {/* Sizes Selection (Industrial / Sharp) */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-8">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/40">Selecione o Tamanho</span>
                  <Link href="/guide" className="text-primary hover:underline transition-all underline-offset-4 decoration-2">Guia de Medidas 📏</Link>
               </div>
               <div className="flex flex-wrap gap-2 text-center items-center justify-start">
                  {product.sizes.map((size) => (
                    <button 
                        key={size}
                        className={cn(
                            "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border border-white/10 font-black text-xs md:text-sm uppercase tracking-widest transition-all",
                            size === "G" ? "bg-white text-black border-white" : "text-white/40 hover:text-white hover:border-white/40"
                        )}
                    >
                        {size}
                    </button>
                  ))}
               </div>
            </div>

            {/* CTA: WHATSAPP CHECKOUT (High Impact) */}
            <div className="flex flex-col gap-4 pt-4">
                <button className="group w-full md:w-auto px-12 py-6 bg-white text-black font-black uppercase text-xs md:text-sm tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-4 hover:scale-[1.02] shadow-2xl active:scale-100 border border-white">
                    <Smartphone className="w-5 h-5 group-hover:rotate-[15deg] transition-transform" />
                    Finalizar Pedido no WhatsApp
                </button>
                <div className="flex items-center gap-2 justify-center py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">Pronta entrega em Palmas (TO)</p>
                </div>
            </div>

            {/* Info Grid (Trust Symbols) */}
            <div className="grid grid-cols-2 gap-4 mt-8 border-t border-white/5 pt-12">
                <div className="flex flex-col gap-3 p-6 bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                    <Truck size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase text-white">Frete Grátis</span>
                    <p className="text-[10px] text-white/30 lowercase font-medium">100% Grátis para qualquer setor de Palmas.</p>
                </div>
                <div className="flex flex-col gap-3 p-6 bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase text-white">Agilidade Local</span>
                    <p className="text-[10px] text-white/30 lowercase font-medium">Receba hoje mesmo – estoque em Palmas TO.</p>
                </div>
            </div>

            {/* Detailed Description (Typography Focus) */}
            <div className="flex flex-col gap-6 mt-12 py-12 border-t border-white/5">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Product <span className="text-primary italic">Manifesto</span></h3>
                <div className="flex flex-col gap-4 text-xs md:text-sm text-white/50 leading-loose italic font-medium max-w-lg">
                    {product.description.map((line, idx) => (
                        <p key={idx}>{line}</p>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Floating Massive Overlay Text */}
      <div className="absolute top-[30%] -left-20 rotate-90 select-none pointer-events-none opacity-[0.02] hidden xl:block">
         <h2 className="text-[20rem] font-black text-white italic tracking-tighter uppercase whitespace-nowrap">BAGGYHYPE</h2>
      </div>

      <Footer />
    </div>
  );
}
