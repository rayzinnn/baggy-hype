"use client";

import { useCart } from "@/providers/CartProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Smartphone } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, total, count, updateQuantity, removeItem, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    address: "",
  });

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer, couponCode }),
      });
      const data = (await response.json()) as { whatsappUrl?: string; error?: string };

      if (!response.ok || !data.whatsappUrl) {
        throw new Error(data.error || "Erro ao registrar pedido.");
      }

      window.open(data.whatsappUrl, "_blank");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao registrar pedido.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-black flex flex-col overflow-x-hidden selection:bg-primary/40 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
        <header className="flex flex-col gap-2 mb-16">
          <div className="flex items-center gap-3">
            <span className="w-10 h-[3px] bg-primary" />
            <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-white/40 italic">
              Carrinho / {count} itens
            </h2>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white">
            Meu <span className="text-primary italic">carrinho</span>
          </h1>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-8 border border-white/5 bg-white/[0.02]">
            <ShoppingBag size={64} className="text-white/10" />
            <div className="text-center flex flex-col gap-2">
              <p className="text-xl font-bold uppercase tracking-widest text-white/40 italic">Carrinho vazio.</p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Volta pra vitrine e escolhe o tamanho certo.</p>
            </div>
            <Link href="/" className="px-10 py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all border border-white">
              Ver vitrine
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 flex flex-col gap-8">
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId || item.size}`} className="flex flex-col md:flex-row gap-8 border-b border-white/5 pb-8 group transition-all">
                  <div className="relative w-full md:w-32 aspect-[3/4] bg-neutral-900 overflow-hidden border border-white/10">
                    <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 128px" className="object-cover grayscale group-hover:grayscale-0 transition-grayscale duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic text-white group-hover:text-primary transition-colors">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id, item.size, item.variantId)}
                          className="p-2 text-white/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {item.color && <span>Cor: <span className="text-white italic">{item.color}</span> | </span>}
                        Tamanho: <span className="text-white italic">{item.size || "Unico"}</span>
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-8">
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1, item.variantId)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-white transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.variantId)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-white transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-2xl font-black italic tracking-tighter text-white">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={clearCart}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-red-500 transition-colors self-start mt-4"
              >
                Limpar Carrinho
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-white/[0.03] border border-white/5 p-8 md:p-12 flex flex-col gap-12 sticky top-32">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">
                  Resumo do <span className="text-primary italic">pedido</span>
                </h3>

                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 gap-3">
                    <input value={customer.name} onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))} placeholder="Nome completo" className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary" />
                    <input value={customer.email} onChange={(event) => setCustomer((prev) => ({ ...prev, email: event.target.value }))} placeholder="E-mail" className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary" />
                    <input value={customer.phone} onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value }))} placeholder="WhatsApp" className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary" />
                    <input value={customer.document} onChange={(event) => setCustomer((prev) => ({ ...prev, document: event.target.value }))} placeholder="CPF ou CNPJ" className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary" />
                    <textarea value={customer.address} onChange={(event) => setCustomer((prev) => ({ ...prev, address: event.target.value }))} placeholder="Endereco para entrega" rows={3} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary resize-none" />
                    <input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} placeholder="Cupom (opcional)" className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-primary uppercase" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/40">Subtotal</span>
                    <span className="text-white">R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/40">Entrega Palmas-TO</span>
                    <span className="text-green-500 font-bold tracking-[0.3em]">GRATIS</span>
                  </div>
                  <div className="w-full h-px bg-white/10 mt-2" />
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Total</span>
                    <span className="text-4xl font-black italic tracking-tighter text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="group w-full py-6 bg-white text-black font-black uppercase text-xs md:text-sm tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-4 hover:scale-[1.02] shadow-2xl active:scale-100 border border-white disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    {isCheckingOut ? "Registrando pedido..." : "Finalizar no WhatsApp"}
                  </button>
                  <div className="flex flex-col items-center gap-2 mt-4 opacity-50">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <p className="text-[8px] font-bold uppercase tracking-widest text-white">Entrega local / retirada combinada</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-8 border-t border-white/5 opacity-30">
                  <div className="flex items-center gap-3">
                    <Smartphone size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Suporte no WhatsApp para fechar pedido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
