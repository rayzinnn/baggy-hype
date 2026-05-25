import Link from "next/link";
import { Instagram, MapPin, Truck, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-surface/50 border-t border-white/5 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Info */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="text-3xl font-black tracking-tighter uppercase italic">
            Baggy<span className="text-primary italic">Hype</span>
          </Link>
          <p className="text-muted text-sm font-medium leading-relaxed max-w-xs lowercase">
            Streetwear oversized em Palmas-TO. Vitrine direto ao ponto, fit certo e fechamento no WhatsApp.
          </p>
          <div className="flex items-center gap-4 text-white/50">
            <Link href="https://instagram.com/baggy_hype" className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-all">
               <Instagram size={20} />
            </Link>
            <Link href="#" className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-all">
               <Phone size={20} />
            </Link>
          </div>
        </div>

        {/* Links Rapidos */}
        <div className="flex flex-col gap-6">
          <h4 className="font-black uppercase text-xs tracking-widest text-primary">Navegacao</h4>
          <ul className="flex flex-col gap-3 text-sm font-bold uppercase tracking-tight text-white/50">
            <li><Link href="/catalog" className="hover:text-white transition-colors">Vitrine completa</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Atendimento</Link></li>
          </ul>
        </div>

        {/* Diferenciais Palmas */}
        <div className="flex flex-col gap-6">
          <h4 className="font-black uppercase text-xs tracking-widest text-primary">Diferenciais</h4>
          <ul className="flex flex-col gap-4">
             <li className="flex gap-3">
                <Truck className="w-5 h-5 text-white/40 shrink-0" />
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black uppercase text-white">Frete grátis em Palmas</span>
                   <p className="text-[10px] text-muted-foreground lowercase">Entrega local quando a campanha estiver ativa.</p>
                </div>
             </li>
             <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-white/40 shrink-0" />
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black uppercase text-white">Retirada Local</span>
                   <p className="text-[10px] text-muted-foreground lowercase">Combine prova ou retirada pelo WhatsApp.</p>
                </div>
             </li>
          </ul>
        </div>

        {/* Atendimento */}
        <div className="flex flex-col gap-6">
          <h4 className="font-black uppercase text-xs tracking-widest text-primary">Suporte</h4>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-loose">
             Dúvidas? <br/>
             Pedido no site e fechamento no WhatsApp <br/>
             Segunda a sábado / 09:00 às 19:00
          </p>
          <Link href="/contact" className="w-fit px-6 py-3 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-white hover:text-black transition-all">
             Central de Ajuda
          </Link>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
         <p>© 2026 Baggy Hype / Palmas - TO</p>
         <div className="flex gap-8">
            <Link href="/terms" className="hover:text-white">Termos</Link>
            <Link href="/privacy" className="hover:text-white">Privacidade</Link>
         </div>
      </div>
    </footer>
  );
};
