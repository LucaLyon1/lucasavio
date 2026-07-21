import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import Nav from "@/components/nav";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Luca Savio",
  description: "Essays and notes, cross-posted from Substack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sourceSerif.variable}>
      <body className="antialiased">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
