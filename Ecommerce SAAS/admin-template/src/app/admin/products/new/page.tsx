import { prisma } from "@/lib/prisma";
import { NewProductForm } from "./NewProductForm";
import Link from "next/link";
import { FolderTree } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (categories.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-lg bg-surface border border-white/5 rounded-3xl p-8 md:p-10 text-center flex flex-col items-center gap-5 shadow-2xl">
          <FolderTree className="text-primary" size={42} />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Cadastre uma categoria primeiro</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-white/35 leading-relaxed">
              Produtos precisam de categoria para aparecerem corretamente no catálogo e nos filtros.
            </p>
          </div>
          <Link href="/admin/categories" className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
            Criar categoria
          </Link>
        </div>
      </div>
    );
  }

  return <NewProductForm categories={categories.map((category) => ({ id: category.id, name: category.name }))} />;
}
