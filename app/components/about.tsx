import Image from "next/image";
import Card from "./card";
import SectionHeading from "./section-heading";
import Button from "./button";

const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/luca-savio1/", target: "_blank" },
  { label: "GitHub", href: "https://github.com/LucaLyon1/lucasavio", target: "_blank" },
  { label: "Email", href: "mailto:savioluca2@gmail.com" },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="About" />

      <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
        <Card className="relative aspect-4/5 w-full overflow-hidden bg-surface">
          <Image
            src="/IMG_9530.jpg"
            alt="Luca Savio"
            fill
            priority
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover"
          />
        </Card>

        <div className="max-w-xl">
          <p className="text-lg leading-relaxed text-ink/70">
            I’m a software engineer who spends a good part of every week reading
            10-Ks, backtesting portfolio ideas, and writing about both. This site
            is where I keep a running, honest record: what I hold, what I’m
            reading, and what I think I’ve learned — with the caveat that most of
            it will look naive in five years.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            Outside of markets and code, I’m usually at a keyboard, on a trail,
            or three chapters into something I’ll mention below.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {links.map((link) => (
              <Button key={link.label} href={link.href} target={link.target} variant="secondary">
                {link.label}
              </Button>
            ))}
            <Button href="/Luca%20Savio-BA.pdf" target="_blank" download variant="primary">
              Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
