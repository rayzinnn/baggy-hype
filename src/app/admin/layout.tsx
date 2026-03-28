"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  ShoppingBag,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Produtos", href: "/admin/products", icon: Package },
    { name: "Pedidos (WA)", href: "/admin/orders", icon: ShoppingBag },
    { name: "Configurações", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-primary/20">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r border-white/5 flex flex-col gap-8 p-6 hidden md:flex">
        <div className="py-2">
            <Link href="/" className="text-2xl font-black uppercase italic tracking-tighter text-white">
                Baggy<span className="text-primary italic">Admin</span>
            </Link>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                pathname === item.href 
                  ? "bg-white text-black" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
                <Home size={18} />
                Ir para o Site
            </Link>
            <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              Sair da Conta
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-md sticky top-0 bg-black/50 z-50">
           <Link href="/" className="text-xl font-black uppercase italic tracking-tighter text-white">
                Baggy<span className="text-primary italic">Admin</span>
            </Link>
            <button className="text-white">
                <LayoutDashboard size={24} />
            </button>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="max-w-6xl mx-auto h-full">
            {children}
           </div>
        </section>
      </main>
    </div>
  );
}
