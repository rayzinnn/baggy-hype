"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, User, X } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
  banner?: {
    text: string;
    visible: boolean;
  };
}

const links = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalogo" },
  { href: "/drops", label: "Drops" },
  { href: "/contact", label: "Contato" },
];

export const Navbar = ({ banner }: NavbarProps) => {
  const { count } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col border-b border-white/10 bg-black/85 backdrop-blur-md">
      {banner?.visible && (
        <div className="w-full bg-primary min-h-8 flex items-center justify-center px-4 text-center">
          <p className="text-[10px] md:text-sm font-black tracking-widest text-black uppercase">{banner.text}</p>
        </div>
      )}

      <nav className="flex items-center justify-between px-4 md:px-8 h-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden p-2 -ml-2 text-white"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="text-xl md:text-3xl font-black tracking-tighter uppercase italic text-white hover:text-primary transition-colors">
            Baggy<span className="text-primary italic">Hype</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-widest uppercase">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("transition-colors", pathname === link.href ? "text-primary" : "text-white hover:text-primary")}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/admin/dashboard" className="hover:text-primary transition-colors text-white/40 flex items-center gap-2">
            <User size={14} /> Admin
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="p-2 hover:bg-white/10 rounded-full transition-all text-white"
            aria-label={searchOpen ? "Fechar busca" : "Abrir busca"}
            aria-expanded={searchOpen}
          >
            <Search size={22} strokeWidth={2.5} />
          </button>
          <ThemeToggle />
          <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-all text-white group" aria-label="Abrir carrinho">
            <ShoppingBag size={22} strokeWidth={2.5} />
            <span className={cn(
              "absolute -top-1 -right-1 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg",
              count > 0 ? "bg-primary text-black animate-in zoom-in duration-300" : "bg-white/10 text-white/40"
            )}>
              {count}
            </span>
          </Link>
        </div>
      </nav>

      {searchOpen && (
        <form action="/catalog" className="border-t border-white/10 bg-black px-4 py-3 md:px-8">
          <div className="mx-auto flex max-w-7xl gap-2">
            <input
              name="q"
              autoFocus
              placeholder="Buscar camiseta, calca, drop..."
              className="h-12 min-w-0 flex-1 bg-white/5 px-4 text-xs font-bold uppercase tracking-widest text-white outline-none placeholder:text-white/25 focus:bg-white/10"
            />
            <button className="h-12 bg-primary px-5 text-[10px] font-black uppercase tracking-widest text-black">Buscar</button>
          </div>
        </form>
      )}

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black px-4 py-4">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "px-4 py-4 text-xs font-black uppercase tracking-widest",
                  pathname === link.href ? "bg-primary text-black" : "bg-white/5 text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className="px-4 py-4 text-xs font-black uppercase tracking-widest bg-white/5 text-white/50">
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
