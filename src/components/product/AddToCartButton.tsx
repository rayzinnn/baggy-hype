"use client";

import { useCart } from "@/providers/CartProvider";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        price: number;
        images: string;
        sizes: string;
    }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [isAdded, setIsAdded] = useState(false);

    const sizes = JSON.parse(product.sizes);
    const images = JSON.parse(product.images);

    const handleAdd = () => {
        if (!selectedSize && sizes.length > 0) {
            alert("Por favor, selecione um tamanho.");
            return;
        }

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: images[0] || "/post01.jpg",
            quantity: 1,
            size: selectedSize
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 3000);
    };

    return (
        <div className="flex flex-col gap-6 pt-4">
            {/* Tamanhos Selection */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-8">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/40">Selecione o Tamanho</span>
                  <span className="text-primary tracking-widest italic">Stock: Palmas - TO</span>
               </div>
               <div className="flex flex-wrap gap-2 text-center items-center justify-start">
                  {sizes.length > 0 ? (
                      sizes.map((size: string) => (
                        <button 
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border font-black text-xs md:text-sm uppercase tracking-widest transition-all ${
                                selectedSize === size 
                                ? "bg-primary border-primary text-black" 
                                : "bg-transparent border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                            }`}
                        >
                            {size}
                        </button>
                      ))
                  ) : (
                      <p className="text-[10px] uppercase font-bold text-white/20 italic">Tamanho único</p>
                  )}
               </div>
            </div>

            <button 
                onClick={handleAdd}
                className={`group w-full md:w-auto px-12 py-6 font-black uppercase text-xs md:text-sm tracking-[0.2em] transition-all flex items-center justify-center gap-4 hover:scale-[1.02] shadow-2xl active:scale-100 border ${
                    isAdded 
                    ? "bg-green-500 border-green-500 text-black" 
                    : "bg-white text-black hover:bg-primary border-white"
                }`}
            >
                {isAdded ? (
                    <>
                        <Check className="w-5 h-5" /> Adicionado!
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Adicionar ao Drop
                    </>
                )}
            </button>
        </div>
    );
}
