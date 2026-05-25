import { updateSiteConfig } from "@/lib/actions/site-config";
import { HomeBannerManager } from "@/components/admin/HomeBannerManager";
import { Image as ImageIcon, Layout, Save, Smartphone } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" },
  }) || {
    topBannerText: "FRETE GRÁTIS EM PALMAS - TO / ENTREGA LOCAL",
    whatsappNumber: "5563999999999",
    isBannerVisible: true,
    heroImage1: "/post01.jpg",
    heroImage2: "/post01.jpg",
    heroImage3: "/post01.jpg",
    heroMobileImage1: "/post01.jpg",
    heroMobileImage2: "/post01.jpg",
    heroMobileImage3: "/post01.jpg",
    heroLinkHref1: "/catalog",
    heroLinkHref2: "/catalog",
    heroLinkHref3: "/catalog",
    heroCtaLabel: "Ver catálogo",
    heroCtaHref: "/catalog",
    heroSecondaryLabel: "Falar no WhatsApp",
    heroSecondaryHref: "/contact",
    heroLinkHref: "/catalog",
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          Configurações <span className="text-primary italic">do site</span>
        </h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Banner, WhatsApp e imagens da home</p>
      </header>

      <form action={updateSiteConfig} className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
        <div className="bg-surface p-5 md:p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <Layout className="text-primary" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Visual & banners</h3>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Texto do banner superior</span>
            <textarea
              name="topBannerText"
              rows={3}
              defaultValue={config.topBannerText}
              className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all resize-none"
              placeholder="Ex: FRETE GRÁTIS PARA PALMAS..."
            />
          </label>

          <label className="flex items-center gap-3 p-4 bg-black/50 rounded-2xl border border-white/5">
            <input name="isBannerVisible" type="checkbox" defaultChecked={config.isBannerVisible} className="w-4 h-4 accent-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 cursor-pointer">Banner visível no site</span>
          </label>

          <div className="flex items-center gap-3 mt-4 mb-2">
            <Smartphone className="text-primary" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Contato de vendas</h3>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Número WhatsApp (com DDI/DDD)</span>
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
              <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Banners da hero</h3>
            </div>

            <HomeBannerManager
              initialBanners={[
                { desktop: config.heroImage1, mobile: config.heroMobileImage1, href: config.heroLinkHref1 || config.heroLinkHref },
                { desktop: config.heroImage2, mobile: config.heroMobileImage2, href: config.heroLinkHref2 || config.heroLinkHref },
                { desktop: config.heroImage3, mobile: config.heroMobileImage3, href: config.heroLinkHref3 || config.heroLinkHref },
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Texto CTA principal</span>
                <input name="heroCtaLabel" defaultValue={config.heroCtaLabel} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">URL CTA principal</span>
                <input name="heroCtaHref" defaultValue={config.heroCtaHref} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Texto CTA secundário</span>
                <input name="heroSecondaryLabel" defaultValue={config.heroSecondaryLabel} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">URL CTA secundario</span>
                <input name="heroSecondaryHref" defaultValue={config.heroSecondaryHref} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-black uppercase text-xs tracking-widest py-6 rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.01] active:scale-95 duration-200"
          >
            Salvar configurações
            <Save size={16} strokeWidth={3} />
          </button>
        </div>
      </form>
    </div>
  );
}
