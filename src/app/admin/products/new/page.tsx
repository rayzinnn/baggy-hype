"use client";

import { createProduct } from "@/lib/actions/products";
import { Package, Plus, ChevronLeft, Upload, Info, Loader2, AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { useActionState, useState, useRef } from "react";

export default function NewProductPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await createProduct(formData);
  }, null);

  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const handleFakeUpload = () => {
    const url = prompt("Insira a URL da imagem (Ex: /post01.jpg ou https://...):", "/post01.jpg");
    if (url) {
        setImageUrl(prev => prev ? `${prev}, ${url}` : url);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex items-center gap-6">
        <Link 
            href="/admin/products" 
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all hover:bg-white/10"
        >
            <ChevronLeft size={20} />
        </Link>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Lançar <span className="text-primary italic">Novo Drop</span></h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest italic">Fragmentos da alma urbana em forma de tecido</p>
        </div>
      </header>

      {state?.error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-black uppercase tracking-widest animate-shake">
              <AlertCircle size={18} />
              {state.error}
          </div>
      )}

      <form action={formAction} className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {/* Lado Esquerdo: Info Básica */}
        <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 bg-gradient-to-b from-primary to-transparent"></div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Nome do Produto</label>
                    <input 
                        name="name" 
                        required
                        type="text" 
                        placeholder="Ex: Baggy Oversized Tribal"
                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-white/10"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Descrição / Storytelling</label>
                    <textarea 
                        name="description" 
                        rows={5}
                        required
                        placeholder="Descreva a atitude desse drop. Detalhes de tecido (Heavyweight), caimento (Drop shoulder)..."
                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all resize-none placeholder:text-white/10"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Preço (R$)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black italic tracking-tighter text-sm">R$</span>
                            <input 
                                name="price" 
                                required
                                type="text" 
                                placeholder="159.90"
                                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:border-primary outline-none transition-all uppercase font-black"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 text-white">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Categoria</label>
                        <select 
                            name="category"
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all appearance-none uppercase font-black"
                        >
                            <option value="Camisetas">Camisetas</option>
                            <option value="Moletons">Moletons</option>
                            <option value="Calças">Calças</option>
                            <option value="Acessórios">Acessórios</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary">Tamanhos Disponíveis (Separados por vírgula)</label>
                    <input 
                        name="sizes" 
                        required
                        type="text" 
                        defaultValue="P, M, G, GG"
                        placeholder="P, M, G, GG"
                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all uppercase font-black tracking-widest"
                    />
                    <p className="text-[9px] text-white/20 uppercase font-bold flex items-center gap-1.5"><Info size={10} /> Exemplo: P, M, G, GG</p>
                </div>
            </div>
        </div>

        {/* Lado Direito: Imagens & Destaque */}
        <div className="flex flex-col gap-6">
            <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 bg-primary/10 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                <label className="text-[10px] font-black uppercase tracking-widest text-primary relative z-10">Mídia do Drop (URLs)</label>
                
                <div className="flex flex-col gap-4 relative z-10">
                    <div 
                        onClick={handleFakeUpload}
                        className="w-full aspect-square border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all cursor-pointer bg-black/40 group/upload"
                    >
                        <Upload size={32} className="text-white/20 group-hover/upload:text-primary transition-all" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover/upload:text-white">Adicionar URL de Imagem</span>
                    </div>
                    <input 
                        name="images" 
                        required
                        type="text" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://imgur.com/image1.jpg, ..."
                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all font-mono text-[10px]"
                    />
                    <p className="text-[8px] text-white/15 uppercase font-bold text-center">URLs separadas por vírgula. Use /post01.jpg para teste.</p>
                </div>
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl relative group">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white">Drop Destaque?</label>
                        <p className="text-[8px] font-bold text-white/20 uppercase">Home Page Hero / Grid</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            name="isFeatured" 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-6 bg-primary text-black font-black uppercase italic text-lg tracking-tighter rounded-3xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 group"
            >
                {isPending ? (
                    <Loader2 size={24} className="animate-spin" />
                ) : (
                    <>
                        <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                        Lançar Agora
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
}
