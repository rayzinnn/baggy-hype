import { MediaUploaderField } from "@/components/admin/MediaUploaderField";
import { createCategory, deleteCategory, updateCategory } from "@/lib/actions/categories";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { FolderTree, Plus, Save, Search, Star, Trash2 } from "lucide-react";

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

      <form action={createCategory} className="bg-surface border border-white/5 rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-[1fr_260px_120px_auto] gap-4">
        <input name="name" required placeholder="Nome da categoria" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
        <select name="parentId" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary">
          <option value="">Sem categoria pai</option>
          {parentOptions.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <input name="sortOrder" placeholder="Ordem" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
        <button className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
          <Plus size={16} />
          Criar
        </button>
        <div className="lg:col-span-3">
          <MediaUploaderField productId="" name="imageUrl" label="Foto redonda da categoria" mediaType="IMAGE" accept="image/*" commitToDb={false} multiple={false} />
        </div>
        <label className="flex items-center justify-center gap-3 rounded-2xl bg-black/50 border border-white/10 px-5 py-4">
          <input name="isFeatured" type="checkbox" className="h-4 w-4 accent-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Destaque</span>
        </label>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-surface border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-black">
                  {category.imageUrl ? (
                    <Image src={category.imageUrl} alt={category.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-primary">
                      <FolderTree size={20} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black uppercase text-white truncate">{category.name}</span>
                    {category.isFeatured && <Star size={13} className="text-primary" fill="currentColor" />}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                    {category.parent ? `Subcategoria de ${category.parent.name}` : "Categoria principal"} | {category._count.products} produtos | ordem {category.sortOrder}
                  </span>
                </div>
              </div>
              <form action={deleteCategory.bind(null, category.id)}>
                <button className="p-3 bg-white/5 text-white/40 rounded-xl hover:text-white hover:bg-red-500 transition-all" aria-label={`Excluir ${category.name}`}>
                  <Trash2 size={16} />
                </button>
              </form>
            </div>

            <form action={updateCategory.bind(null, category.id)} className="grid grid-cols-1 gap-3">
              <input name="name" required defaultValue={category.name} className="bg-black/50 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-primary" />
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_110px] gap-3">
                <select name="parentId" defaultValue={category.parentId || ""} className="bg-black/50 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-primary">
                  <option value="">Sem categoria pai</option>
                  {parentOptions.filter((option) => option.id !== category.id).map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
                <input name="sortOrder" defaultValue={category.sortOrder} className="bg-black/50 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-primary" />
              </div>
              <MediaUploaderField productId="" name="imageUrl" label="Foto destaque" initialValue={category.imageUrl || ""} mediaType="IMAGE" accept="image/*" commitToDb={false} multiple={false} />
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-3 rounded-2xl bg-black/50 border border-white/10 px-4 py-3">
                  <input name="isFeatured" type="checkbox" defaultChecked={category.isFeatured} className="h-4 w-4 accent-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Categoria destaque</span>
                </label>
                <button className="px-5 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
                  <Save size={14} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
