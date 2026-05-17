import { createCategory, deleteCategory } from "@/lib/actions/categories";
import { prisma } from "@/lib/prisma";
import { FolderTree, Plus, Search, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({
    where: params.q ? { name: { contains: params.q } } : {},
    include: { parent: true, children: true, _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  const parentOptions = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Categorias <span className="text-primary italic">Site</span></h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Categorias e subcategorias livres</p>
      </header>

      <form action="/admin/categories" className="bg-surface border border-white/5 rounded-3xl p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 w-4 h-4" />
          <input name="q" defaultValue={params.q || ""} placeholder="Buscar categoria..." className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-primary" />
        </div>
        <button className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
          Buscar
        </button>
      </form>

      <form action={createCategory} className="bg-surface border border-white/5 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-4">
        <input name="name" required placeholder="Nome da categoria" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
        <select name="parentId" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary">
          <option value="">Sem categoria pai</option>
          {parentOptions.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
          <Plus size={16} />
          Criar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-surface border border-white/5 rounded-3xl p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <FolderTree className="text-primary shrink-0" size={20} />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-black uppercase text-white truncate">{category.name}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                  {category.parent ? `Subcategoria de ${category.parent.name}` : "Categoria principal"} | {category._count.products} produtos
                </span>
              </div>
            </div>
            <form action={deleteCategory.bind(null, category.id)}>
              <button className="p-3 bg-white/5 text-white/40 rounded-xl hover:text-white hover:bg-red-500 transition-all">
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
