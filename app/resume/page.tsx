import SectionEyebrow from "@/components/section-eyebrow";

const experience = [
  {
    role: "Financial Valuation Consultant",
    org: "ATRIOM",
    dates: "Sep 2023 – May 2026",
    bullets: [
      "Performed business valuations for M&A transactions and IFRS impairment testing.",
      "Built financial models: DCF, trading/transaction multiples, Monte Carlo simulation.",
      "Wrote financial analysis reports for statutory auditors and CFOs.",
    ],
  },
  {
    role: "Founder",
    org: "Coinhunt",
    dates: "Jan 2020 – Jun 2022",
    bullets: [
      "Founded and grew a digital-assets business from zero.",
      "Owned client acquisition and day-to-day operations.",
      "Sold the company in 2022.",
    ],
  },
  {
    role: "Software Development Intern",
    org: "Axopen",
    dates: "Sep 2019 – Feb 2020",
    bullets: [
      "Developed and maintained a nuclear power plant management application.",
      "Delivered in a high-stakes, high-rigor client environment.",
    ],
  },
];

const education = [
  {
    degree: "Engineering Degree — Mathematical & Computer Modeling",
    org: "Polytech Lyon",
    dates: "2021",
    detail: "Statistics, probability, linear algebra, algorithms.",
  },
  {
    degree: "Master's in Financial Analysis",
    org: "Inseec Paris",
    dates: "2023",
    detail: "Asset valuation, financial markets, portfolio management.",
  },
];

const skills = [
  "Python / SQL (advanced)",
  "Financial mathematics",
  "Advanced probability",
  "Business valuation (DCF, multiples, Monte Carlo)",
  "Excel / VBA",
  "English C1/C2 · French native",
];

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-275 px-6 py-24 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <SectionEyebrow>Resume</SectionEyebrow>
          <h1 className="font-sans text-3xl font-bold text-strat-text">Luca Savio</h1>
          <p className="mt-2 font-mono text-sm text-strat-muted">
            savioluca2@gmail.com · +33 6 88 26 33 82 ·{" "}
            <a
              href="https://www.linkedin.com/in/luca-savio1/"
              className="text-strat-accent hover:underline"
            >
              LinkedIn
            </a>
          </p>
        </div>
        <a
          href="/resume-luca-savio-en.pdf"
          className="rounded-lg border border-black/13 px-5 py-3 font-sans text-sm font-semibold text-strat-text hover:border-strat-accent hover:text-strat-accent"
        >
          Download PDF (EN)
        </a>
      </div>

      <p className="mt-8 max-w-2xl font-sans text-base font-light text-strat-muted">
        Engineering and finance graduate with three years of experience in financial
        valuation and modeling in a consulting environment, plus entrepreneurial
        experience founding and selling a company. Strong interest in financial
        analysis and quantitative problem-solving.
      </p>

      <section className="mt-16">
        <h2 className="mb-6 font-sans text-xl font-bold text-strat-text">Experience</h2>
        <div className="flex flex-col gap-8">
          {experience.map((job) => (
            <div key={job.role} className="border-l-2 border-black/13 pl-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-sans text-lg font-semibold text-strat-text">
                  {job.role} · {job.org}
                </h3>
                <span className="font-mono text-xs uppercase tracking-widest text-strat-muted">
                  {job.dates}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-1.5">
                {job.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="font-sans text-sm font-light text-strat-muted"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 font-sans text-xl font-bold text-strat-text">Education</h2>
        <div className="flex flex-col gap-6">
          {education.map((item) => (
            <div key={item.degree} className="border-l-2 border-black/13 pl-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-sans text-lg font-semibold text-strat-text">
                  {item.degree}
                </h3>
                <span className="font-mono text-xs uppercase tracking-widest text-strat-muted">
                  {item.org} · {item.dates}
                </span>
              </div>
              <p className="mt-2 font-sans text-sm font-light text-strat-muted">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 font-sans text-xl font-bold text-strat-text">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-black/13 px-3.5 py-1.5 font-mono text-xs text-strat-text"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
