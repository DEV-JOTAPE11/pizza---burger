import type { Metadata } from "next";
import { Archivo_Black, Inter, Yellowtail } from "next/font/google";
import PageMotion from "@/components/effects/PageMotion";
import SmoothScroll from "@/components/effects/SmoothScroll";
import { MOTION_BOOT_SCRIPT } from "@/lib/motion";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const script = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forno & Brasa — Pizza & Burger",
  description:
    "Hambúrgueres artesanais, pizzas de forno e acompanhamentos. Ingredientes frescos e sabores marcantes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${script.variable}`}
      /* O script inline abaixo acrescenta a classe `motion` antes do React
         hidratar — é uma diferença esperada entre servidor e cliente. */
      suppressHydrationWarning
    >
      <head>
        {/* Liga o estado inicial das animações antes da primeira pintura.
            Sem JS — ou com `prefers-reduced-motion` — a classe nunca entra
            e a página é servida inteira, sem nada escondido. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body>
        {/* A rolagem suave monta antes das revelações para que o ticker
            que move a página seja o mesmo que move as animações. */}
        <SmoothScroll />
        <PageMotion />
        {children}
      </body>
    </html>
  );
}
