"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciais inválidas. Tente novamente.");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                Baggy<span className="text-primary italic">Admin</span>
            </h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
                Painel de Controle Exclusivo
            </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-surface p-8 rounded-3xl border border-white/5 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase p-3 rounded-lg text-center animate-shake">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Email</label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary transition-all outline-none"
                    placeholder="ex@baggy.com"
                    required
                />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Senha</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary transition-all outline-none"
                    placeholder="••••••••"
                    required
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-black uppercase text-xs tracking-widest py-4 rounded-xl mt-4 hover:bg-primary transition-all disabled:opacity-50"
          >
            {isLoading ? "Acessando..." : "Entrar no Painel"}
          </button>
        </form>

        <p className="text-center text-[9px] font-bold uppercase tracking-widest text-white/20">
            Acesso Restrito • Baggy Hype Streetwear 2026
        </p>
      </div>
    </div>
  );
}
