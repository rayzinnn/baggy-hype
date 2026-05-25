import { createCoupon, deleteCoupon } from "@/lib/actions/coupons";
import { prisma } from "@/lib/prisma";
import { BadgePercent, Plus, Search, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CouponsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const [coupons, categories, products] = await Promise.all([
    prisma.coupon.findMany({
      where: params.q ? { code: { contains: params.q } } : {},
      include: { category: true, product: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Cupons <span className="text-primary italic">Desconto</span></h2>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Percentual, valor fixo ou frete grátis</p>
      </header>

      <form action="/admin/coupons" className="bg-surface border border-white/5 rounded-3xl p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 w-4 h-4" />
          <input name="q" defaultValue={params.q || ""} placeholder="Buscar cupom..." className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white uppercase outline-none focus:border-primary" />
        </div>
        <button className="px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
          Buscar
        </button>
      </form>

      <form action={createCoupon} className="flex flex-col gap-4">
        <section className="bg-surface border border-white/5 rounded-3xl p-5 md:p-8 flex flex-col gap-4">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Codigo do cupom</h3>
          <input name="code" required placeholder="JANEIROPROMO" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white uppercase outline-none focus:border-primary" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Este codigo sera inserido pelo cliente no checkout.</p>
        </section>

        <section className="bg-surface border border-white/5 rounded-3xl p-5 md:p-8 flex flex-col gap-5">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Tipo de desconto</h3>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
            <select name="discountType" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary">
              <option value="PERCENT">Porcentagem</option>
              <option value="FIXED">Valor fixo</option>
              <option value="FREE_SHIPPING">Frete grátis</option>
            </select>
            <input name="value" placeholder="10 ou 25.00" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50">
              <input name="includeShipping" type="checkbox" className="accent-primary" />
              Inclui envio
            </label>
          </div>
        </section>

        <section className="bg-surface border border-white/5 rounded-3xl p-5 md:p-8 flex flex-col gap-5">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Aplicar a</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="appliesTo" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary">
              <option value="STORE">Toda loja</option>
              <option value="CATEGORY">Categorias</option>
              <option value="PRODUCT">Produtos</option>
            </select>
            <select name="categoryId" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary">
              <option value="">Categoria alvo</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <select name="productId" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary">
              <option value="">Produto alvo</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
          </div>
        </section>

        <section className="bg-surface border border-white/5 rounded-3xl p-5 md:p-8 flex flex-col gap-5">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Limites de uso</h3>
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50">
            <input name="combinesWithPromos" type="checkbox" defaultChecked className="accent-primary" />
            Permitir combinar com preço promocional e outras promoções
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="usageLimit" placeholder="Limite por cupom" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
            <input name="perCustomerLimit" placeholder="Limite por cliente" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
            <input name="minCartValue" placeholder="Valor minimo do carrinho" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
            <input name="maxDiscount" placeholder="Valor maximo de desconto" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
            <input name="startsAt" type="date" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
            <input name="endsAt" type="date" className="bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-primary" />
          </div>
          <div className="flex flex-wrap gap-5 text-[10px] font-black uppercase tracking-widest text-white/50">
            <label className="flex items-center gap-2"><input name="firstPurchaseOnly" type="checkbox" className="accent-primary" />Primeira compra</label>
            <label className="flex items-center gap-2"><input name="isActive" type="checkbox" defaultChecked className="accent-primary" />Ativo</label>
          </div>
          <button className="w-full sm:w-auto sm:self-end px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
            <Plus size={16} />
            Criar Cupom
          </button>
        </section>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-surface border border-white/5 rounded-3xl p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <BadgePercent className="text-primary shrink-0" size={20} />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black uppercase text-white">{coupon.code}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{coupon.discountType} | {coupon.appliesTo} | {coupon.isActive ? "ativo" : "inativo"}</span>
              </div>
            </div>
            <form action={deleteCoupon.bind(null, coupon.id)}>
              <button className="p-3 bg-white/5 text-white/40 rounded-xl hover:text-white hover:bg-red-500 transition-all"><Trash2 size={16} /></button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
