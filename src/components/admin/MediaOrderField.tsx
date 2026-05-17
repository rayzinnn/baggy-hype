"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export function MediaOrderField({ name, initialValue = "", placeholder }: { name: string; initialValue?: string; placeholder: string }) {
  const [items, setItems] = useState(() => initialValue.split(",").map((item) => item.trim()).filter(Boolean));
  const [draft, setDraft] = useState("");
  const value = useMemo(() => items.join(", "), [items]);

  const move = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-2">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} className="flex-1 bg-black/50 border border-white/10 rounded-2xl py-4 px-4 text-xs text-white outline-none focus:border-primary" />
        <button type="button" onClick={() => { if (draft.trim()) { setItems((current) => [...current, draft.trim()]); setDraft(""); } }} className="px-4 bg-white text-black rounded-2xl hover:bg-primary transition-all">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
            <span className="text-[10px] font-mono text-white/60 truncate">{index + 1}. {item}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => move(index, -1)} className="p-2 bg-white/5 rounded-lg"><ArrowUp size={12} /></button>
              <button type="button" onClick={() => move(index, 1)} className="p-2 bg-white/5 rounded-lg"><ArrowDown size={12} /></button>
              <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="p-2 bg-white/5 rounded-lg hover:bg-red-500"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
