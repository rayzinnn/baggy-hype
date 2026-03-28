import { auth } from "@/auth";
import { Package, ShoppingBag, Eye, TrendingUp, Settings } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  
  let productCount = 0;
  let orderCount = 0;

  try {
    productCount = await prisma.product.count();
    orderCount = await prisma.order.count();
  } catch (e) {
    console.error("Dashboard count error:", e);
  }

  const stats = [
    { name: "Total de Produtos", value: productCount, icon: Package, color: "text-blue-500" },
    { name: "Intenções de Compra", value: orderCount, icon: ShoppingBag, color: "text-primary" },
    { name: "Cliques no Drop", value: "1.2k", icon: Eye, color: "text-green-500" },
    { name: "Conversão Est. (WA)", value: "4.2%", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Dashboard <span className="text-primary italic">Overview</span></h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Resumo de desempenho Baggy Hype</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-surface p-6 rounded-3xl border border-white/5 flex flex-col gap-4 shadow-xl">
             <div className="flex items-center justify-between">
                <stat.icon size={20} className={stat.color} />
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">+12%</span>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black italic tracking-tighter">{stat.value}</span>
                <span className="text-[9px] font-bold uppercase text-white/40 tracking-widest mt-1">{stat.name}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Últimos Pedidos / Atividade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-surface rounded-3xl border border-white/5 p-8 flex flex-col gap-6 shadow-2xl">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Últimos Pedidos <span className="text-white/20 italic">(WA Clicks)</span></h3>
            <div className="flex flex-col gap-4">
                <p className="text-center text-[9px] font-bold uppercase tracking-widest text-white/20 mt-4">Ver todos os pedidos</p>
            </div>
         </div>

         <div className="bg-surface rounded-3xl border border-white/5 p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 bg-primary/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter relative z-10">Acesso Rápido</h3>
            <div className="grid grid-cols-2 gap-4 relative z-10">
                <Link href="/admin/products" className="bg-black/40 hover:bg-black/60 border border-white/10 p-5 rounded-2xl flex flex-col gap-3 transition-all hover:scale-[1.02]">
                    <Package size={20} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Novo Drop</span>
                </Link>
                <Link href="/admin/settings" className="bg-black/40 hover:bg-black/60 border border-white/10 p-5 rounded-2xl flex flex-col gap-3 transition-all hover:scale-[1.02]">
                    <Settings size={20} className="text-white/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Alterar Banner</span>
                </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
