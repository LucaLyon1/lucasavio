import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-160 items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="font-serif text-lg font-semibold text-ink">
          Luca Savio
        </Link>
        <a
          href="https://lucasavio.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none"
        >
          Subscribe
        </a>
      </div>
    </header>
  );
}
