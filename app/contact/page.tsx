import type { Metadata } from "next";
import Contact from "../components/contact";

export const metadata: Metadata = {
  title: "Contact — Luca Savio",
};

export default function ContactPage() {
  return <Contact />;
}
