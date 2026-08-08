import SectionHeading from "./section-heading";
import Button from "./button";

const links = [
  { label: "Email", href: "mailto:savioluca2@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/luca-savio1/" },
  { label: "GitHub", href: "https://github.com/LucaLyon1/lucasavio" },
];

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <SectionHeading label="Contact" />

      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Get in touch
      </h2>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
        Open to conversations about markets, software, or anything on the
        articles page. Reach out through whichever channel is easiest.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {links.map((link) => (
          <Button key={link.label} href={link.href} variant="secondary">
            {link.label}
          </Button>
        ))}
        <Button href="/Luca%20Savio-BA.pdf" target="_blank" download variant="primary">
          Download resume
        </Button>
      </div>
    </section>
  );
}
