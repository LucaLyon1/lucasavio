import type { Metadata } from "next";
import { Outfit, DM_Mono } from "next/font/google";
import Nav from "@/components/nav";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Luca Savio — Quantitative Research & Trading",
  description:
    "Financial modeler turned quant: real backtests, a live paper-traded strategy, and the code behind them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmMono.variable}`}>
      <body className="antialiased">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
