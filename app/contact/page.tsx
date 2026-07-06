import SectionEyebrow from "@/components/section-eyebrow";

const links = [
  { label: "Email", value: "savioluca2@gmail.com", href: "mailto:savioluca2@gmail.com" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/luca-savio1",
    href: "https://www.linkedin.com/in/luca-savio1/",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-175 px-6 py-24 sm:px-8">
      <SectionEyebrow>Contact</SectionEyebrow>
      <h1 className="font-sans text-3xl font-bold text-strat-text">Get in touch</h1>
      <p className="mt-4 max-w-md font-sans text-base font-light text-strat-muted">
        Happy to talk about any of the projects on this site, or roles in
        quantitative research and trading.
      </p>

      <div className="mt-10 flex flex-col gap-px overflow-hidden rounded-2xl bg-black/7">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center justify-between bg-strat-bg px-6 py-5 transition-colors hover:bg-strat-bg3"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-strat-muted">
              {link.label}
            </span>
            <span className="font-mono text-sm text-strat-text">{link.value}</span>
          </a>
        ))}
        <a
          href="/resume-luca-savio-en.pdf"
          className="flex items-center justify-between bg-strat-bg px-6 py-5 transition-colors hover:bg-strat-bg3"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-strat-muted">
            Resume
          </span>
          <span className="font-mono text-sm text-strat-accent">Download PDF</span>
        </a>
      </div>
    </div>
  );
}
