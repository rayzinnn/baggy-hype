"use client";

import { CalendarDays } from "lucide-react";
import type { RefObject } from "react";
import { useRef, useState } from "react";

type DateRangeFilterProps = {
  action: string;
  from: string;
  to: string;
  extra?: Record<string, string>;
};

export function DateRangeFilter({ action, from, to, extra = {} }: DateRangeFilterProps) {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const [fromValue, setFromValue] = useState(from);
  const [toValue, setToValue] = useState(to);

  const openPicker = (ref: RefObject<HTMLInputElement | null>) => {
    ref.current?.showPicker?.();
    ref.current?.focus();
  };

  return (
    <form action={action} className="bg-surface border border-white/5 rounded-[1.75rem] p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-end shadow-xl">
      {Object.entries(extra).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <div className="flex flex-col gap-2 flex-1 sm:flex-none">
        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 px-1">Inicio</label>
        <button type="button" onClick={() => openPicker(fromRef)} className="w-full sm:min-w-36 bg-black border border-white/10 rounded-2xl px-5 py-4 text-xs font-black text-primary text-left hover:border-primary/50 transition-all">
          {fromValue.split("-").reverse().join("/")}
        </button>
        <input ref={fromRef} name="from" type="date" value={fromValue} onChange={(event) => setFromValue(event.target.value)} className="sr-only" />
      </div>
      <div className="flex flex-col gap-2 flex-1 sm:flex-none">
        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 px-1">Fim</label>
        <button type="button" onClick={() => openPicker(toRef)} className="w-full sm:min-w-36 bg-black border border-white/10 rounded-2xl px-5 py-4 text-xs font-black text-primary text-left hover:border-primary/50 transition-all">
          {toValue.split("-").reverse().join("/")}
        </button>
        <input ref={toRef} name="to" type="date" value={toValue} onChange={(event) => setToValue(event.target.value)} className="sr-only" />
      </div>
      <button className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-3">
        <CalendarDays size={14} />
        Filtrar
      </button>
    </form>
  );
}
