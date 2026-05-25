import { CheckCircle2, Edit3, Package, Plus, Search, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { deleteProduct } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

function parseJsonList(value: string, fallback: string[]) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : fallback;
  } catch {
    return fallback;
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const products = await prisma.product.findMany({
    where: {
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { slug: { contains: params.q } },
            ],
          }
        : {}),
      ...(params.category ? { categoryId: params.category } : {}),
    },
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Produtos <span className="text-primary italic">da loja</span></h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Cadastro, variantes e estoque</p>
        </div>
        <Link href="/admin/products/new" className="w-full md:w-auto px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-3 hover:bg-primary transition-all">
          <Plus size={16} strokeWidth={3} />
          Novo produto
        </Link>
      </header>

      <form action="/admin/products" className="grid grid-cols-1 md:grid-cols-[1fr_240px_auto] gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
          <input name="q" defaultValue={params.q || ""} placeholder="Buscar por nome ou slug..." className="w-full bg-surface border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white focus:border-primary outline-none transition-all" />
        </div>
        <select name="category" defaultValue={params.category || ""} className="bg-surface border border-white/10 rounded-2xl py-4 px-4 text-xs text-white focus:border-primary outline-none">
          <option value="">Todas categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">Aplicar</button>
      </form>

      <div className="md:hidden flex flex-col gap-3">
        {products.length === 0 ? (
          <div className="bg-surface border border-white/5 rounded-3xl p-10 text-center">
            <Package size={36} className="text-white/10 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Nenhum produto cadastrado.</p>
          </div>
        ) : (
          products.map((product) => {
            const images = parseJsonList(product.images, ["/post01.jpg"]);
            const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
            const cost = product.cost ? Number(product.cost) : null;
            const sellPrice = Number(product.promoPrice || product.price);
            const margin = cost ? ((sellPrice - cost) / sellPrice) * 100 : null;

            return (
              <article key={product.id} className="bg-surface border border-white/5 rounded-3xl p-4 flex gap-4">
                <div className="w-20 aspect-[3/4] bg-black rounded-2xl overflow-hidden relative shrink-0">
                  <Image src={images[0] || "/post01.jpg"} alt={product.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-black uppercase tracking-tight text-white truncate">{product.name}</h3>
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary">{product.category.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 bg-white/5 rounded-xl text-white/60"><Edit3 size={14} /></Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <button className="p-2 bg-white/5 rounded-xl text-white/60 hover:bg-red-500 hover:text-white"><Trash2 size={14} /></button>
                      </form>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[9px] font-black uppercase tracking-widest">
                    <span className="rounded-2xl bg-black/50 border border-white/5 p-3 text-white/40">Preço<br /><b className="text-white text-xs">R$ {sellPrice.toFixed(2)}</b></span>
                    <span className="rounded-2xl bg-black/50 border border-white/5 p-3 text-white/40">Estoque<br /><b className={stock > 0 ? "text-primary text-xs" : "text-red-500 text-xs"}>{stock}</b></span>
                    <span className="rounded-2xl bg-black/50 border border-white/5 p-3 text-white/40">Margem<br /><b className="text-white text-xs">{margin === null ? "-" : `${margin.toFixed(1)}%`}</b></span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div className="hidden md:block bg-surface rounded-3xl border border-white/5 overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[940px]">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Produto</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Categoria</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Preço</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Variantes</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Estoque</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Margem</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Destaque</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-20 text-center">
                  <Package size={40} className="text-white/10 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Nenhum drop cadastrado.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const images = parseJsonList(product.images, ["/post01.jpg"]);
                const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
                const cost = product.cost ? Number(product.cost) : null;
                const sellPrice = Number(product.promoPrice || product.price);
                const margin = cost ? ((sellPrice - cost) / sellPrice) * 100 : null;

                return (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl overflow-hidden relative shrink-0">
                          <Image src={images[0] || "/post01.jpg"} alt={product.name} fill sizes="48px" className="object-cover opacity-80 group-hover:opacity-100 transition-all" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-black uppercase tracking-tight text-white">{product.name}</span>
                          <span className="text-[9px] font-bold text-white/20 uppercase">{product.slug || product.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><span className="text-[9px] font-black uppercase tracking-tight text-primary">{product.category.name}</span></td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black italic text-white">R$ {sellPrice.toFixed(2)}</span>
                      {product.promoPrice && <span className="block text-[9px] line-through text-white/20">R$ {product.price.toString()}</span>}
                    </td>
                    <td className="px-6 py-5"><span className="text-[10px] font-black text-white/40">{product.variants.length}</span></td>
                    <td className="px-6 py-5"><span className={stock > 0 ? "text-primary font-black" : "text-red-500 font-black"}>{stock}</span></td>
                    <td className="px-6 py-5"><span className="text-[10px] font-black text-white/40">{margin === null ? "-" : `${margin.toFixed(1)}%`}</span></td>
                    <td className="px-6 py-5">{product.isFeatured ? <CheckCircle2 size={16} className="text-primary" /> : <XCircle size={16} className="text-white/10" />}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/products/${product.id}/edit`} className="p-2 hover:bg-white text-white hover:text-black bg-white/5 rounded-lg transition-all"><Edit3 size={14} /></Link>
                        <form action={deleteProduct.bind(null, product.id)}>
                          <button className="p-2 hover:bg-red-500 text-white bg-white/5 rounded-lg transition-all"><Trash2 size={14} /></button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
