import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar banner={{ text: config?.topBannerText || "FRETE GRATIS PARA PALMAS - TO | ENTREGA HOJE", visible: config?.isBannerVisible ?? true }} />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-4 py-16 md:px-8 md:py-24">
        <header className="flex flex-col gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Baggy Hype</span>
          <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter md:text-8xl">Termos de compra</h1>
        </header>
        <div className="grid gap-4 text-sm leading-relaxed text-white/55">
          <p>Os pedidos sao registrados no site e finalizados por WhatsApp. A reserva do produto depende da confirmacao de pagamento e disponibilidade de estoque.</p>
          <p>Precos, campanhas, cupons e condicoes de entrega podem mudar sem aviso previo. Em caso de divergencia, vale a confirmacao enviada no atendimento.</p>
          <p>Trocas e ajustes sao combinados individualmente pelo WhatsApp, considerando estado da peca, prazo de contato e disponibilidade de tamanho ou modelo.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
