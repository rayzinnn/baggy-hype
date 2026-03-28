import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Catálogo <span className="text-primary italic">Produtos</span></h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Gestão de estoque e drops</p>
        </div>
        <Link 
            href="/admin/products/new" 
            className="w-full md:w-auto px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-95 shadow-xl shadow-white/5"
        >
            <Plus size={16} strokeWidth={3} />
            Lançar Novo Drop
        </Link>
      </header>

      {/* BARRA DE FILTRO E BUSCA */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
            <input 
                type="text" 
                placeholder="Buscar produto por nome ou tag..." 
                className="w-full bg-surface border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white focus:border-primary outline-none transition-all"
            />
        </div>
        <button className="px-6 py-4 bg-surface border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
            <Filter size={16} />
            Filtros
        </button>
      </div>

      {/* TABELA / LISTAGEM */}
      <div className="bg-surface rounded-3xl border border-white/5 overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
           <thead className="bg-white/5 border-b border-white/5">
             <tr>
               <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Produto</th>
               <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Categoria</th>
               <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Preço</th>
               <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Tamanhos</th>
               <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Destaque</th>
               <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Ações</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             {products.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-20 text-center flex flex-col items-center gap-4 mx-auto w-full">
                        <Package size={40} className="text-white/10" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Nenhum drop cadastrado ainda.</p>
                    </td>
                </tr>
             ) : (
                products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-xl overflow-hidden relative shrink-0">
                                   {/* Pego a primeira imagem do JSON de imgs */}
                                   <Image 
                                      src={JSON.parse(p.images)[0] || "/post01.jpg"} 
                                      alt={p.name} 
                                      fill 
                                      className="object-cover opacity-80 group-hover:opacity-100 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-black uppercase tracking-tight text-white">{p.name}</span>
                                    <span className="text-[9px] font-bold text-white/20 uppercase">ID: {p.id.slice(0, 8)}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tight text-primary">
                                {p.category.name}
                            </span>
                        </td>
                        <td className="px-6 py-5">
                            <span className="text-sm font-black italic tracking-tighter text-white">R$ {p.price.toString()}</span>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex gap-1.5">
                                {JSON.parse(p.sizes).map((s: string) => (
                                    <span key={s} className="text-[9px] font-black text-white/40 border border-white/5 px-2 py-1 rounded-md">{s}</span>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-5">
                           {p.isFeatured ? (
                               <CheckCircle2 size={16} className="text-primary" />
                           ) : (
                               <XCircle size={16} className="text-white/10" />
                           )}
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                                <button className="p-2 hover:bg-white text-black bg-white/5 rounded-lg transition-all">
                                    <Edit3 size={14} />
                                </button>
                                <button className="p-2 hover:bg-red-500 text-white bg-white/5 rounded-lg transition-all group-hover:border-red-500/30">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
             )}
           </tbody>
        </table>
      </div>
      
      <p className="text-center text-[9px] font-bold uppercase tracking-[0.5em] text-white/10 mt-8">
        Baggy Hype • Gestão de Catálogo • 2026
      </p>
    </div>
  );
}
