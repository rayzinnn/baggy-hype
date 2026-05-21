"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type VariantRow = {
  color: string;
  size: string;
  stock: string;
  price: string;
  promoPrice: string;
  cost: string;
  media: string;
};

function parseInitial(value: string): VariantRow[] {
  const rows = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [color = "", size = "", stock = "", price = "", promoPrice = "", cost = "", media = ""] = line.split("|").map((item) => item.trim());
      return { color, size, stock, price, promoPrice, cost, media };
    });

  return rows.length > 0 ? rows : [{ color: "", size: "", stock: "", price: "", promoPrice: "", cost: "", media: "" }];
}

export function VariantEditor({ initialValue = "" }: { initialValue?: string }) {
  const [rows, setRows] = useState<VariantRow[]>(() => parseInitial(initialValue));
  const serialized = useMemo(
    () =>
      rows
        .filter((row) => Object.values(row).some((value) => value.trim()))
        .map((row) => `${row.color} | ${row.size} | ${row.stock} | ${row.price} | ${row.promoPrice} | ${row.cost} | ${row.media}`)
        .join("\n"),
    [rows]
  );

  const updateRow = (index: number, key: keyof VariantRow, value: string) => {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  };

  const move = (index: number, direction: -1 | 1) => {
    setRows((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const fields: { key: keyof VariantRow; label: string; placeholder: string; type?: string; className?: string }[] = [
    { key: "color", label: "Cor", placeholder: "Preto" },
    { key: "size", label: "Tamanho", placeholder: "G" },
    { key: "stock", label: "Estoque", placeholder: "0", type: "number" },
    { key: "price", label: "Preco", placeholder: "199.90", type: "number" },
    { key: "promoPrice", label: "Preco promo", placeholder: "179.90", type: "number" },
    { key: "cost", label: "Custo", placeholder: "80.00", type: "number" },
    { key: "media", label: "Midias da variante", placeholder: "URLs separadas por virgula", className: "md:col-span-2 xl:col-span-3" },
  ];

  return (
    <div className="bg-surface p-5 sm:p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl">
      <input type="hidden" name="variants" value={serialized} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-black uppercase italic tracking-tighter">Variantes</h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Cor, tamanho, estoque e precificacao por opcao.</p>
        </div>
        <button type="button" onClick={() => setRows((current) => [...current, { color: "", size: "", stock: "0", price: "", promoPrice: "", cost: "", media: "" }])} className="px-4 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
          <Plus size={14} />
          Adicionar
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row, index) => (
          <div key={index} className="rounded-[1.5rem] border border-white/5 bg-black/20 p-4 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Variante {String(index + 1).padStart(2, "0")}</span>
                <span className="text-xs font-bold text-white/35">{row.color || "Cor"} / {row.size || "Tamanho"} / estoque {row.stock || "0"}</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => move(index, -1)} className="h-10 w-10 grid place-items-center bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-30" disabled={index === 0} aria-label="Mover variante para cima">
                  <ArrowUp size={14} />
                </button>
                <button type="button" onClick={() => move(index, 1)} className="h-10 w-10 grid place-items-center bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-30" disabled={index === rows.length - 1} aria-label="Mover variante para baixo">
                  <ArrowDown size={14} />
                </button>
                <button type="button" onClick={() => setRows((current) => (current.length === 1 ? [{ color: "", size: "", stock: "0", price: "", promoPrice: "", cost: "", media: "" }] : current.filter((_, rowIndex) => rowIndex !== index)))} className="h-10 w-10 grid place-items-center bg-white/5 rounded-xl hover:bg-red-500 hover:text-white" aria-label="Remover variante">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {fields.map((field) => (
                <label key={field.key} className={`flex flex-col gap-2 ${field.className || ""}`}>
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-primary">{field.label}</span>
                  <input
                    value={row[field.key]}
                    type={field.type || "text"}
                    step={field.type === "number" ? "0.01" : undefined}
                    min={field.key === "stock" ? "0" : undefined}
                    placeholder={field.placeholder}
                    onChange={(event) => updateRow(index, field.key, event.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-primary placeholder:text-white/15"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
