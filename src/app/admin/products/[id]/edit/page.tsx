import { MediaOrderField } from "@/components/admin/MediaOrderField";
import { VariantEditor } from "@/components/admin/VariantEditor";
import { updateProduct } from "@/lib/actions/products";
import { prisma } from "@/lib/prisma";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function parseJsonList(value: string, fallback: string[]) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : fallback;
  } catch {
    return fallback;
  }
}

function money(value: { toString: () => string } | null) {
  return value ? value.toString() : "";
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: { orderBy: [{ color: "asc" }, { size: "asc" }] } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();
  const productId = product.id;
  const images = parseJsonList(product.images, ["/post01.jpg"]).join(", ");
  const videos = parseJsonList(product.videos, []).join(", ");
  const variantsText = product.variants
    .map((variant) => {
      const media = parseJsonList(variant.media, []).join(",");
      return `${variant.color} | ${variant.size} | ${variant.stock} | ${money(variant.price)} | ${money(variant.promoPrice)} | ${money(variant.cost)} | ${media}`;
    })
    .join("\n");

  async function updateProductWithId(formData: FormData) {
    "use server";
    await updateProduct(productId, formData);
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex items-center gap-6">
        <Link href="/admin/products" className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Editar <span className="text-primary italic">Drop</span>
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest italic">ID {product.id.slice(0, 8)}</p>
        </div>
      </header>

      <form action={updateProductWithId} className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Nome</span>
                <input name="name" required defaultValue={product.name} className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Slug / URL</span>
                <input name="slug" defaultValue={product.slug || ""} className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Descricao</span>
              <textarea name="description" required rows={5} defaultValue={product.description || ""} className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary resize-none" />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Preco base</span>
                <input name="price" required defaultValue={product.price.toString()} className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Preco promo</span>
                <input name="promoPrice" defaultValue={money(product.promoPrice)} className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Custo</span>
                <input name="cost" defaultValue={money(product.cost)} className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Categoria</span>
                <select name="categoryId" required defaultValue={product.categoryId} className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary">
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <VariantEditor initialValue={variantsText} />

          <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
            <h3 className="text-lg font-black uppercase italic tracking-tighter">SEO</h3>
            <input name="seoTitle" defaultValue={product.seoTitle || ""} placeholder="Titulo SEO" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
            <textarea name="seoDescription" rows={3} defaultValue={product.seoDescription || ""} placeholder="Descricao SEO" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary resize-none" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Midias</h3>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Reordene fotos e videos do produto.</p>
            </div>
            <MediaOrderField name="images" initialValue={images} placeholder="/post01.jpg ou https://..." />
            <MediaOrderField name="videos" initialValue={videos} placeholder="URL do video" />
          </div>
          <label className="bg-surface p-8 rounded-3xl border border-white/5 flex items-center justify-between shadow-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Drop Destaque?</span>
            <input name="isFeatured" type="checkbox" defaultChecked={product.isFeatured} className="w-5 h-5 accent-primary" />
          </label>
          <button type="submit" className="w-full py-6 bg-primary text-black font-black uppercase italic text-lg tracking-tighter rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
            <Save size={20} strokeWidth={3} />
            Salvar Drop
          </button>
        </div>
      </form>
    </div>
  );
}
