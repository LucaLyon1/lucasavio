import Link from "next/link";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/live", label: "Live" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="border-b border-black/7">
      <div className="mx-auto flex max-w-275 items-center justify-between px-6 py-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm tracking-wide text-strat-text"
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-strat-accent shadow-[0_0_12px_#9333ea]"
          />
          LUCA SAVIO
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-strat-muted transition-colors hover:text-strat-accent focus-visible:text-strat-accent focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
