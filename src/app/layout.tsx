import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";
import "./performance.css";
import "./portfolio-reference.css";
import { portfolio } from "@/config/portfolio";

export const metadata: Metadata = {
  title: `Editor de Vídeo para YouTube: Mais Views e CTR | ${portfolio.name}`,
  description: "Editor de vídeo para YouTube. Veja dados reais: CTR de 8,9%, 719h de exibição e +136 inscritos em um único vídeo. Peça seu orçamento.",
  openGraph: {
    title: `Editor de Vídeo para YouTube: Mais Views e CTR | ${portfolio.name}`,
    description: "Editor de vídeo para YouTube com dados reais de CTR, tempo de exibição e inscritos.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
