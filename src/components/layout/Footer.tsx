import Link from "next/link";
import { Instagram, MapPin, Phone, Truck } from "lucide-react";
import { defaultStoreConfig } from "@/lib/store-config";

type FooterConfig = typeof defaultStoreConfig;

export const Footer = ({ config = defaultStoreConfig }: { config?: FooterConfig }) => {
  const location = `${config.city}${config.state ? ` - ${config.state}` : ""}`;

  return (
    <footer className="w-full border-t border-white/5 bg-surface/50 px-4 py-16 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="flex flex-col gap-6">
          <Link href="/" className="text-3xl font-black uppercase italic tracking-tighter">
            {config.storeName}
          </Link>
          <p className="max-w-xs text-sm font-medium leading-relaxed text-muted">{config.footerDescription}</p>
          <div className="flex items-center gap-4 text-white/50">
            {config.instagramUrl && (
              <Link href={config.instagramUrl} className="rounded-full p-2 transition-all hover:bg-white/10 hover:text-white">
                <Instagram size={20} />
              </Link>
            )}
            <Link href={`https://wa.me/${config.whatsappNumber}`} className="rounded-full p-2 transition-all hover:bg-white/10 hover:text-white">
              <Phone size={20} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">Navegacao</h4>
          <ul className="flex flex-col gap-3 text-sm font-bold uppercase tracking-tight text-white/50">
            <li><Link href="/catalog" className="transition-colors hover:text-white">Vitrine completa</Link></li>
            <li><Link href="/drops" className="transition-colors hover:text-white">Lancamentos</Link></li>
            <li><Link href="/admin" className="transition-colors hover:text-white">Painel Admin</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">Diferenciais</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-3">
              <Truck className="h-5 w-5 shrink-0 text-white/40" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-white">Entrega combinada</span>
                <p className="text-[10px] text-muted-foreground">Atendimento e condicoes alinhados pelo WhatsApp.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-white/40" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-white">{location}</span>
                <p className="text-[10px] text-muted-foreground">Retirada ou entrega conforme operacao da loja.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">Suporte</h4>
          <p className="text-[10px] font-black uppercase leading-loose tracking-widest text-white/40">
            Duvidas? <br />
            Pedido no site e fechamento no WhatsApp <br />
            Atendimento conforme horario da loja
          </p>
          <Link href="/contact" className="w-fit rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black">
            Central de ajuda
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 md:flex-row">
        <p>© 2026 {config.storeName} / {location}</p>
        <div className="flex gap-8">
          <Link href="/terms" className="hover:text-white">Termos</Link>
          <Link href="/privacy" className="hover:text-white">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
};
