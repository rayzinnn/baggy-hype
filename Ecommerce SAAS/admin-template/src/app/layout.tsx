import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Painel Admin | E-commerce WhatsApp",
  description: "Painel administrativo para lojas com checkout via WhatsApp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var theme=localStorage.getItem("admin-theme");document.documentElement.classList.toggle("light",theme==="light")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full bg-black text-white selection:bg-primary/30">{children}</body>
    </html>
  );
}
