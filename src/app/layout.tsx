import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/providers/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baggyhype.club"),
  title: "Baggy Hype | Streetwear Palmas",
  description: "Streetwear oversized em Palmas - TO. Pedido no site e fechamento no WhatsApp.",
  keywords: ["streetwear", "Palmas", "Baggy Hype", "oversized", "moda masculina Palmas", "Tocantins"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var theme=localStorage.getItem("baggy-theme");document.documentElement.classList.toggle("light",theme==="light")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-primary/30">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
