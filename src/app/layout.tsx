import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./overrides.css";
import "./performance.css";
import "./portfolio-reference.css";
import { portfolio } from "@/config/portfolio";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: `Editor de Vídeo para YouTube | ${portfolio.name}`,
  description: "Editor de vídeo para YouTube. Veja resultados reais de views, tempo de exibição e novos inscritos. Peça seu orçamento.",
  openGraph: {
    title: `Editor de Vídeo para YouTube | ${portfolio.name}`,
    description: "Editor de vídeo para YouTube com resultados reais de views, tempo de exibição e novos inscritos.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={geist.variable}>{children}</body></html>;
}
