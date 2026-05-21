import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { defaultStoreConfig } from "@/lib/store-config";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
  const site = config || defaultStoreConfig;

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar banner={{ text: site.topBannerText, visible: site.isBannerVisible }} storeName={site.storeName} />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-4 py-16 md:px-8 md:py-24">
        <header className="flex flex-col gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{site.storeName}</span>
          <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter md:text-8xl">Termos de compra</h1>
        </header>
        <div className="grid gap-4 text-sm leading-relaxed text-white/55">
          <p>{site.termsText}</p>
          <p>Precos, campanhas, cupons e condicoes de entrega podem variar. Quando tiver divergencia, vale o que for confirmado no atendimento.</p>
          <p>Trocas e ajustes sao combinados no WhatsApp, considerando prazo, estado da peca e disponibilidade de tamanho/modelo.</p>
        </div>
      </main>
      <Footer config={site} />
    </div>
  );
}
