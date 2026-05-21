import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { defaultStoreConfig } from "@/lib/store-config";
import { prisma } from "@/lib/prisma";
import { Instagram, MapPin, MessageCircle, Truck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
  const site = config || defaultStoreConfig;
  const whatsapp = site.whatsappNumber;

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar banner={{ text: site.topBannerText, visible: site.isBannerVisible }} storeName={site.storeName} />
      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-8 px-4 py-16 md:grid-cols-[1fr_0.8fr] md:px-8 md:py-24">
        <section className="flex flex-col justify-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Atendimento {site.storeName}</span>
          <h1 className="text-6xl font-black uppercase italic leading-[0.85] tracking-tighter md:text-9xl">Fala com a gente</h1>
          <p className="max-w-xl text-sm font-medium leading-relaxed text-white/50 md:text-base">
            Tire duvidas sobre produtos, estoque, entrega e fechamento do pedido diretamente pelo WhatsApp.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`https://wa.me/${whatsapp}`} className="flex items-center justify-center gap-3 bg-primary px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.02]">
              <MessageCircle size={17} />
              Chamar no WhatsApp
            </Link>
            {site.instagramUrl && (
              <Link href={site.instagramUrl} className="flex items-center justify-center gap-3 border border-white/15 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:border-primary hover:text-primary">
                <Instagram size={17} />
                Instagram
              </Link>
            )}
          </div>
        </section>
        <section className="grid gap-4">
          {[
            { icon: MapPin, title: "Base local", text: `${site.city} - ${site.state}. Retirada ou entrega conforme combinacao.` },
            { icon: Truck, title: "Entrega", text: "Condicoes, prazos e disponibilidade alinhados no atendimento." },
            { icon: MessageCircle, title: "Compra assistida", text: "Registre o pedido no site e finalize pelo WhatsApp." },
          ].map((item) => (
            <div key={item.title} className="border border-white/10 bg-white/[0.03] p-8">
              <item.icon className="mb-8 text-primary" size={28} />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">{item.title}</h2>
              <p className="mt-3 text-xs font-bold uppercase leading-relaxed tracking-widest text-white/35">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer config={site} />
    </div>
  );
}
