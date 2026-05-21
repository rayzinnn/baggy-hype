"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, variantId?: string) => void;
  updateQuantity: (id: string, size: string | undefined, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = window.localStorage.getItem("baggy-cart");
    if (!saved) return [];

      try {
        return JSON.parse(saved) as CartItem[];
      } catch (error) {
        console.error("Cart load error", error);
        return [];
      }
  });

  useEffect(() => {
    window.localStorage.setItem("baggy-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size && i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string, size?: string, variantId?: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size && i.variantId === variantId)));
  };

  const updateQuantity = (id: string, size: string | undefined, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(id, size, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.size === size && i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
