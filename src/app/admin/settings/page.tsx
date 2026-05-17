import { updateSiteConfig } from "@/lib/actions/site-config";
import { Image as ImageIcon, Layout, Save, Smartphone } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" },
  }) || {
    topBannerText: "FRETE GRATIS PARA PALMAS - TO | ENTREGA HOJE",
    whatsappNumber: "5563999999999",
    isBannerVisible: true,
    heroImage1: "/post01.jpg",
    heroImage2: "/post01.jpg",
    heroImage3: "/post01.jpg",
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          Configuracoes <span className="text-primary italic">Plataforma</span>
        </h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Ajustes globais do site e contato</p>
      </header>

      <form action={updateSiteConfig} className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
        <div className="bg-surface p-5 md:p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <Layout className="text-primary" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Visual & Banners</h3>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Texto do banner superior</span>
            <textarea
              name="topBannerText"
              rows={3}
              defaultValue={config.topBannerText}
              className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all resize-none"
              placeholder="Ex: FRETE GRATIS PARA PALMAS..."
            />
          </label>

          <label className="flex items-center gap-3 p-4 bg-black/50 rounded-2xl border border-white/5">
            <input name="isBannerVisible" type="checkbox" defaultChecked={config.isBannerVisible} className="w-4 h-4 accent-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 cursor-pointer">Banner visivel no site</span>
          </label>

          <div className="flex items-center gap-3 mt-4 mb-2">
            <Smartphone className="text-primary" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Contato de Vendas</h3>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Numero WhatsApp (com DDI/DDD)</span>
            <input
              name="whatsappNumber"
              type="text"
              defaultValue={config.whatsappNumber}
              className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-black tracking-widest focus:border-primary outline-none transition-all"
              placeholder="5563999999999"
            />
          </label>
        </div>

        <div className="flex flex-col gap-5 md:gap-8">
          <div className="bg-surface p-5 md:p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="text-primary" size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Herois da Home</h3>
            </div>

            {[
              ["heroImage1", "Imagem 1 (Hero Main)", config.heroImage1],
              ["heroImage2", "Imagem 2 (Variacao)", config.heroImage2],
              ["heroImage3", "Imagem 3 (Variacao)", config.heroImage3],
            ].map(([name, label, value]) => (
              <label key={name} className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">{label}</span>
                <input
                  name={name}
                  type="text"
                  defaultValue={value}
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-xs text-white/60 font-mono focus:border-primary outline-none transition-all"
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-black uppercase text-xs tracking-widest py-6 rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.01] active:scale-95 duration-200"
          >
            Salvar Configuracao Global
            <Save size={16} strokeWidth={3} />
          </button>
        </div>
      </form>
    </div>
  );
}
