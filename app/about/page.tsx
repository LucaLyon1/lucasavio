import type { Metadata } from "next";
import About from "../components/about";

export const metadata: Metadata = {
  title: "About — Luca Savio",
};

export default function AboutPage() {
  return (
    <div className="pb-20 sm:pb-28">
      <About />
    </div>
  );
}
