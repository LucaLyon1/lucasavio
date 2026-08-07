import Link from "next/link";
import Button from "./button";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/books", label: "Books" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-300 items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink">
          Luca Savio
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button href="#" variant="primary">
          Resume
        </Button>
      </div>
    </header>
  );
}
