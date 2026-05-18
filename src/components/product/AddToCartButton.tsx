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
        variants?: {
            id: string;
            color: string;
            size: string;
            stock: number;
            price: number | null;
            promoPrice: number | null;
            media: string;
        }[];
    }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const variants = product.variants || [];
    const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || "");
    const [selectedSize, setSelectedSize] = useState("");
    const [isAdded, setIsAdded] = useState(false);

    const sizes = parseJsonList(product.sizes, []);
    const images = parseJsonList(product.images, ["/post01.jpg"]);
    const hasLegacySizeList = sizes.length > 0 && variants.length === 1 && variants[0]?.color === "Unica" && variants[0]?.size === "Unico";
    const selectableVariants = hasLegacySizeList ? [] : variants;
    const selectedVariant = selectableVariants.find((variant) => variant.id === selectedVariantId);

    const handleAdd = () => {
        if (selectableVariants.length > 0 && !selectedVariant) {
            alert("Selecione a variante para continuar.");
            return;
        }

        if (selectedVariant && selectedVariant.stock <= 0) {
            alert("Essa variante esta sem estoque.");
            return;
        }

        if (!selectedVariant && sizes.length > 0 && !selectedSize) {
            alert("Selecione um tamanho para continuar.");
            return;
        }

        const variantImages = selectedVariant ? parseJsonList(selectedVariant.media, images) : images;
        const price = selectedVariant?.promoPrice || selectedVariant?.price || product.price;

        addItem({
            id: product.id,
            variantId: selectedVariant?.id,
            name: product.name,
            price,
            image: variantImages[0] || images[0] || "/post01.jpg",
            quantity: 1,
            color: selectedVariant?.color,
            size: selectedVariant?.size || selectedSize || "",
        });

        fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventType: "CART_ADD",
                productId: product.id,
                metadata: { size: selectedVariant?.size || selectedSize, color: selectedVariant?.color },
            }),
        }).catch(() => {});

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 3000);
    };

    return (
        <div className="flex flex-col gap-6 pt-4">
            {/* Tamanhos Selection */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-8">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/40">Escolha a variacao</span>
                  <span className="text-primary tracking-widest italic">Estoque local</span>
               </div>
               <div className="flex flex-wrap gap-2 text-center items-center justify-start">
                  {selectableVariants.length > 0 ? (
                      selectableVariants.map((variant) => (
                        <button 
                            key={variant.id}
                            onClick={() => setSelectedVariantId(variant.id)}
                            className={`min-w-20 h-14 px-3 flex flex-col items-center justify-center border font-black text-[9px] uppercase tracking-widest transition-all ${
                                selectedVariantId === variant.id 
                                ? "bg-primary border-primary text-black" 
                                : "bg-transparent border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                            }`}
                        >
                            <span>{variant.color}</span>
                            <span>{variant.size} | {variant.stock}</span>
                        </button>
                      ))
                  ) : sizes.length > 0 ? (
                      sizes.map((size: string) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border font-black text-xs md:text-sm uppercase tracking-widest transition-all ${
                                selectedSize === size
                                ? "bg-primary text-black border-primary"
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
                        <Check className="w-5 h-5" /> No carrinho
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Adicionar ao carrinho
                    </>
                )}
            </button>
        </div>
    );
}

function parseJsonList(value: string, fallback: string[]) {
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : fallback;
    } catch {
        return fallback;
    }
}
