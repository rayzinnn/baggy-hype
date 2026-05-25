"use client";

import { createProduct } from "@/lib/actions/products";
import type { ProductActionState } from "@/lib/actions/products";
import { VariantEditor } from "@/components/admin/VariantEditor";
import { MediaUploaderField } from "@/components/admin/MediaUploaderField";
import { AlertCircle, ChevronLeft, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

export function NewProductForm({ categories }: { categories: CategoryOption[] }) {
  const [state, formAction, isPending] = useActionState(async (_prevState: ProductActionState | null, formData: FormData) => {
    return await createProduct(formData);
  }, null);

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex items-center gap-6">
        <Link href="/admin/products" className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Lancar <span className="text-primary italic">Novo Drop</span>
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest italic">Produto pai com variantes livres</p>
        </div>
      </header>

      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-black uppercase tracking-widest">
          <AlertCircle size={18} />
          {state.error}
        </div>
      )}

      <form action={formAction} className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Nome</span>
                <input name="name" required className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Slug / URL</span>
                <input name="slug" placeholder="gerado automaticamente" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Descrição</span>
              <textarea name="description" required rows={5} className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary resize-none" />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Preço base</span>
                <input name="price" required placeholder="159.90" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Preço promo</span>
                <input name="promoPrice" placeholder="129.90" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Custo</span>
                <input name="cost" placeholder="70.00" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Tamanhos</span>
                <input name="mainSize" placeholder="P, M, G, GG" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Estoque</span>
                <input name="mainStock" type="number" min="0" placeholder="0" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Categoria</span>
                <select name="categoryId" required className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary">
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <VariantEditor />

          <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
            <h3 className="text-lg font-black uppercase italic tracking-tighter">SEO</h3>
            <input name="seoTitle" placeholder="Título SEO" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
            <textarea name="seoDescription" rows={3} placeholder="Descrição SEO" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary resize-none" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Mídias</h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">A ordem abaixo define a vitrine do produto.</p>
            </div>
            <MediaUploaderField productId="" name="images" label="Fotos" mediaType="IMAGE" accept="image/*" commitToDb={false} />
            <MediaUploaderField productId="" name="videos" label="Vídeos" mediaType="VIDEO" accept="video/*" commitToDb={false} />
          </div>
          <label className="bg-surface p-8 rounded-3xl border border-white/5 flex items-center justify-between shadow-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Drop Destaque?</span>
            <input name="isFeatured" type="checkbox" className="w-5 h-5 accent-primary" />
          </label>
          <button type="submit" disabled={isPending} className="w-full py-6 bg-primary text-black font-black uppercase italic text-lg tracking-tighter rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            {isPending ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} strokeWidth={3} />}
            Lancar Agora
          </button>
        </div>
      </form>
    </div>
  );
}
