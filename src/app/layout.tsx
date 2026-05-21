import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/providers/CartProvider";
import { getSiteConfig } from "@/lib/data";
import type { CSSProperties } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sualoja.com.br"),
  title: "Nome da Loja | Loja Online",
  description: "Loja online com pedido no site e fechamento pelo WhatsApp.",
  keywords: ["loja online", "catalogo", "ecommerce", "WhatsApp", "vitrine"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      style={{ "--color-primary": config.primaryColor } as CSSProperties}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var theme=localStorage.getItem("storefront-theme");document.documentElement.classList.toggle("light",theme==="light")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-primary/30">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
