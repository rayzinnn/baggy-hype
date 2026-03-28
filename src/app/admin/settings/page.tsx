import { updateSiteConfig } from "@/lib/actions/site-config";
import { Settings, Save, Smartphone, Layout, Image as ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" }
  }) || {
    topBannerText: "🔥 FRETE GRÁTIS PARA PALMAS - TO | ENTREGA HOJE 🏁",
    whatsappNumber: "5563999999999",
    isBannerVisible: true,
    heroImage1: "/post01.jpg",
    heroImage2: "/post01.jpg",
    heroImage3: "/post01.jpg"
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Configurações <span className="text-primary italic">Plataforma</span></h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Ajustes globais do site e contato</p>
      </header>

      <form 
          action={updateSiteConfig}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="bg-surface p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
             <Layout className="text-primary" size={20} />
             <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Visual & Banners</h3>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Texto do Banner Superior</label>
            <textarea 
                name="topBannerText"
                rows={3}
                defaultValue={config.topBannerText}
                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all resize-none"
                placeholder="Ex: FRETE GRÁTIS PARA PALMAS..."
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-black/50 rounded-2xl border border-white/5">
                <input 
                    name="isBannerVisible"
                    type="checkbox" 
                    id="isBannerVisible"
                    defaultChecked={config.isBannerVisible}
                    className="w-4 h-4 accent-primary"
                />
                <label htmlFor="isBannerVisible" className="text-[10px] font-black uppercase tracking-widest text-white/60 cursor-pointer">Banner Visível no Site</label>
            </div>

          <div className="flex items-center gap-3 mt-4 mb-2">
             <Smartphone className="text-primary" size={20} />
             <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Contato de Vendas</h3>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Número WhatsApp (Com DDI/DDD)</label>
            <input 
                name="whatsappNumber"
                type="text" 
                defaultValue={config.whatsappNumber}
                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-black tracking-widest focus:border-primary outline-none transition-all"
                placeholder="5563999999999"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8">
            <div className="bg-surface p-8 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <ImageIcon className="text-primary" size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Heróis da Home (Imagens)</h3>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Imagem 1 (Hero Main)</label>
                        <input 
                            name="heroImage1"
                            type="text" 
                            defaultValue={config.heroImage1}
                            className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-xs text-white/60 font-mono focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Imagem 2 (Variação)</label>
                        <input 
                            name="heroImage2"
                            type="text" 
                            defaultValue={config.heroImage2}
                            className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-xs text-white/60 font-mono focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Imagem 3 (Variação)</label>
                        <input 
                            name="heroImage3"
                            type="text" 
                            defaultValue={config.heroImage3}
                            className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-xs text-white/60 font-mono focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-white text-black font-black uppercase text-xs tracking-widest py-6 rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.01] active:scale-95 duration-200"
            >
                Salvar Configuração Global
                <Save size={16} strokeWidth={3} />
            </button>
        </div>
      </form>
    </div>
  );
}
