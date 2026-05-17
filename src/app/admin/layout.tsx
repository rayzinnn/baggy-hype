"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  FolderTree,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Produtos", href: "/admin/products", icon: Package },
    { name: "Categorias", href: "/admin/categories", icon: FolderTree },
    { name: "Cupons", href: "/admin/coupons", icon: BadgePercent },
    { name: "Pedidos (WA)", href: "/admin/orders", icon: ShoppingBag },
    { name: "Clientes", href: "/admin/customers", icon: Users },
    { name: "Configuracoes", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-primary/20">
      <aside className="hidden md:flex w-72 shrink-0 border-r border-white/10 bg-surface/70 flex-col gap-8 p-5 sticky top-0 h-screen">
        <div className="py-2">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="text-2xl font-black uppercase italic tracking-tighter text-white">
              Baggy<span className="text-primary italic">Admin</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                isActive(item.href) ? "bg-primary text-black shadow-lg shadow-primary/10" : "text-white/45 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Home size={18} />
            Ir para o Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Sair da Conta
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 backdrop-blur-md sticky top-0 bg-black/80 z-50">
          <Link href="/" className="text-xl font-black uppercase italic tracking-tighter text-white">
            Baggy<span className="text-primary italic">Admin</span>
          </Link>
          <ThemeToggle />
        </header>

        <section className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
          <div className="max-w-6xl mx-auto h-full">{children}</div>
        </section>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-xl px-2 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "h-14 min-w-20 rounded-2xl flex flex-col items-center justify-center gap-1 text-[8px] font-black uppercase tracking-tight transition-all",
                  isActive(item.href) ? "bg-primary text-black" : "text-white/45"
                )}
              >
                <item.icon size={17} />
                <span className="leading-none">{item.name.replace(" (WA)", "")}</span>
              </Link>
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
}
