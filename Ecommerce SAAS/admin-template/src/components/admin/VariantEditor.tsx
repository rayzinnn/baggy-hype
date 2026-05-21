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

  return (
    <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col gap-4 shadow-2xl">
      <input type="hidden" name="variants" value={serialized} />
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-black uppercase italic tracking-tighter">Variantes</h3>
        <button type="button" onClick={() => setRows((current) => [...current, { color: "", size: "", stock: "", price: "", promoPrice: "", cost: "", media: "" }])} className="px-4 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2">
          <Plus size={14} />
          Adicionar
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[880px] text-left">
          <thead className="bg-white/5">
            <tr>
              {["Cor", "Tamanho", "Estoque", "Preco", "Promo", "Custo", "Midias", "Ordem"].map((label) => (
                <th key={label} className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-white/40">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, index) => (
              <tr key={index}>
                {(["color", "size", "stock", "price", "promoPrice", "cost", "media"] as const).map((key) => (
                  <td key={key} className="px-3 py-3">
                    <input value={row[key]} onChange={(event) => updateRow(index, key, event.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-3 py-3 text-xs text-white outline-none focus:border-primary" />
                  </td>
                ))}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => move(index, -1)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowUp size={13} /></button>
                    <button type="button" onClick={() => move(index, 1)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowDown size={13} /></button>
                    <button type="button" onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} className="p-2 bg-white/5 rounded-lg hover:bg-red-500"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
