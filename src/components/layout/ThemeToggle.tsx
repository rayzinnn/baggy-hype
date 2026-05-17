"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const nextIsLight = !isLight;
    setIsLight(nextIsLight);
    document.documentElement.classList.toggle("light", nextIsLight);
    window.localStorage.setItem("baggy-theme", nextIsLight ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:text-primary hover:border-primary/40 transition-all"
      aria-label={isLight ? "Ativar tema escuro" : "Ativar tema claro"}
    >
      {isLight ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
