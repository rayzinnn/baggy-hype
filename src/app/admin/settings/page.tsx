import { updateSiteConfig } from "@/lib/actions/site-config";
import { defaultStoreConfig } from "@/lib/store-config";
import { prisma } from "@/lib/prisma";
import { Globe2, Image as ImageIcon, Layout, Palette, Save, Search, Smartphone } from "lucide-react";

export const dynamic = "force-dynamic";

function Field({
  label,
  name,
  value,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="px-1 text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-primary"
      />
    </label>
  );
}

function TextArea({ label, name, value, rows = 3 }: { label: string; name: string; value: string; rows?: number }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="px-1 text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={value}
        className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-sm leading-relaxed text-white outline-none transition-all placeholder:text-white/20 focus:border-primary"
      />
    </label>
  );
}

export default async function SettingsPage() {
  const config = (await prisma.siteConfig.findUnique({
    where: { id: "singleton" },
  })) || defaultStoreConfig;

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          Setup <span className="text-primary italic">da loja</span>
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          Identidade, contato, SEO, home e politicas do cliente
        </p>
      </header>

      <form action={updateSiteConfig} className="grid grid-cols-1 gap-5 md:gap-8 xl:grid-cols-[1fr_0.9fr]">
        <div className="flex flex-col gap-5 md:gap-8">
          <section className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-surface p-5 shadow-2xl md:p-8">
            <div className="flex items-center gap-3">
              <Globe2 className="text-primary" size={20} />
              <h3 className="text-sm font-black uppercase italic tracking-widest text-white">Identidade do cliente</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nome da loja" name="storeName" value={config.storeName} />
              <Field label="Slug interno" name="storeSlug" value={config.storeSlug} placeholder="loja-cliente" />
              <Field label="Dominio" name="domain" value={config.domain} placeholder="https://loja.com.br" />
              <Field label="Instagram" name="instagramUrl" value={config.instagramUrl} placeholder="https://instagram.com/loja" />
              <Field label="Cidade" name="city" value={config.city} />
              <Field label="Estado" name="state" value={config.state} placeholder="UF" />
            </div>
          </section>

          <section className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-surface p-5 shadow-2xl md:p-8">
            <div className="flex items-center gap-3">
              <Search className="text-primary" size={20} />
              <h3 className="text-sm font-black uppercase italic tracking-widest text-white">SEO e copy principal</h3>
            </div>
            <Field label="Titulo SEO" name="seoTitle" value={config.seoTitle} />
            <TextArea label="Descricao SEO" name="seoDescription" value={config.seoDescription} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Eyebrow da home" name="heroEyebrow" value={config.heroEyebrow} />
              <Field label="Titulo da home" name="heroTitle" value={config.heroTitle} />
            </div>
            <Field label="Destaque do titulo" name="heroHighlight" value={config.heroHighlight} />
            <TextArea label="Descricao da home" name="heroDescription" value={config.heroDescription} />
            <TextArea label="Descricao do rodape" name="footerDescription" value={config.footerDescription} />
          </section>

          <section className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-surface p-5 shadow-2xl md:p-8">
            <div className="flex items-center gap-3">
              <Layout className="text-primary" size={20} />
              <h3 className="text-sm font-black uppercase italic tracking-widest text-white">Politicas e banner</h3>
            </div>
            <TextArea label="Texto do banner superior" name="topBannerText" value={config.topBannerText} />
            <label className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/50 p-4">
              <input name="isBannerVisible" type="checkbox" defaultChecked={config.isBannerVisible} className="h-4 w-4 accent-primary" />
              <span className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-white/60">
                Banner visivel no site
              </span>
            </label>
            <TextArea label="Politica de privacidade" name="privacyText" value={config.privacyText} rows={4} />
            <TextArea label="Termos de compra" name="termsText" value={config.termsText} rows={4} />
          </section>
        </div>

        <div className="flex flex-col gap-5 md:gap-8">
          <section className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-surface p-5 shadow-2xl md:p-8">
            <div className="flex items-center gap-3">
              <Palette className="text-primary" size={20} />
              <h3 className="text-sm font-black uppercase italic tracking-widest text-white">Visual</h3>
            </div>
            <Field label="Cor principal" name="primaryColor" value={config.primaryColor} placeholder="#f7d117" />
            <Field label="URL da logo" name="logoUrl" value={config.logoUrl} placeholder="/logo.png" />
            <Field label="URL do favicon" name="faviconUrl" value={config.faviconUrl} placeholder="/favicon.ico" />
          </section>

          <section className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-surface p-5 shadow-2xl md:p-8">
            <div className="flex items-center gap-3">
              <Smartphone className="text-primary" size={20} />
              <h3 className="text-sm font-black uppercase italic tracking-widest text-white">Contato de vendas</h3>
            </div>
            <Field label="WhatsApp com DDI/DDD" name="whatsappNumber" value={config.whatsappNumber} placeholder="5500000000000" />
          </section>

          <section className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-surface p-5 shadow-2xl md:p-8">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-primary" size={20} />
              <h3 className="text-sm font-black uppercase italic tracking-widest text-white">Imagens da home</h3>
            </div>
            {[
              ["heroImage1", "Imagem principal", config.heroImage1],
              ["heroImage2", "Imagem secundaria", config.heroImage2],
              ["heroImage3", "Imagem terciaria", config.heroImage3],
            ].map(([name, label, value]) => (
              <Field key={name} label={label} name={name} value={value} placeholder="/post01.jpg" />
            ))}
          </section>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-6 text-xs font-black uppercase tracking-widest text-black shadow-2xl transition-all duration-200 hover:scale-[1.01] hover:bg-primary active:scale-95"
          >
            Salvar setup da loja
            <Save size={16} strokeWidth={3} />
          </button>
        </div>
      </form>
    </div>
  );
}
