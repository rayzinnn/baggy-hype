"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, User } from "lucide-react";
import { useCart } from "@/providers/CartProvider";

interface NavbarProps {
  banner?: {
    text: string;
    visible: boolean;
  };
}

export const Navbar = ({ banner }: NavbarProps) => {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col border-b border-white/10 bg-black/80 backdrop-blur-md">
      {/* Banner de Entrega Palmas-TO */}
      {banner?.visible && (
        <div className="w-full bg-primary h-8 flex items-center justify-center">
            <p className="text-[10px] md:text-sm font-bold tracking-widest text-black uppercase animate-pulse">
                {banner.text}
            </p>
        </div>
      )}
      
      {/* Navbar Principal */}
      <nav className="flex items-center justify-between px-4 md:px-8 h-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 -ml-2 text-white">
            <Menu size={24} />
          </button>
          <Link href="/" className="text-xl md:text-3xl font-black tracking-tighter uppercase italic text-white hover:text-primary transition-colors">
            Baggy<span className="text-primary italic">Hype</span>
          </Link>
        </div>

        {/* Links Desktop */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-widest uppercase">
          <Link href="/" className="hover:text-primary transition-colors text-white">Home</Link>
          <Link href="/catalog" className="hover:text-primary transition-colors text-white">Catálogo</Link>
          <Link href="/admin/dashboard" className="hover:text-primary transition-colors text-white/40 flex items-center gap-2">
            <User size={14} /> Admin
          </Link>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-all text-white">
            <Search size={22} strokeWidth={2.5} />
          </button>
          <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-all text-white group">
            <ShoppingBag size={22} strokeWidth={2.5} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-in zoom-in duration-300">
                {count}
              </span>
            )}
            {count === 0 && (
              <span className="absolute -top-1 -right-1 bg-white/10 text-white/40 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};
