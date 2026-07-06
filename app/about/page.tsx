import SectionEyebrow from "@/components/section-eyebrow";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-175 px-6 py-24 sm:px-8">
      <SectionEyebrow>About</SectionEyebrow>
      <h1 className="font-sans text-3xl font-bold text-strat-text">
        Why I&apos;m moving into quant
      </h1>

      <div className="mt-8 flex flex-col gap-5 font-sans text-base font-light text-strat-muted">
        <p>
          I studied mathematical and computer modeling at Polytech Lyon — statistics,
          probability, linear algebra, algorithms — then a master&apos;s in financial
          analysis at Inseec Paris. In between, I founded Coinhunt, a digital-assets
          business I ran for two years and sold in 2022. That was the first time I saw
          markets up close, not just in a textbook.
        </p>
        <p>
          For the last three years I worked as a valuation consultant at ATRIOM,
          building DCF, multiples, and Monte Carlo models for M&amp;A deals and IFRS
          impairment tests, and writing the reports that auditors and CFOs actually
          rely on. It taught me how to build a financial model that has to be
          <em> right</em> — defensible, sourced, stress-tested — not just directionally
          plausible.
        </p>
        <p>
          Quant research is the place where that instinct for rigor meets the coding
          and statistics I trained in originally. This site is where I&apos;m proving
          that out in public: real backtests with stated methodology, a strategy
          trading on a live paper account, and the code behind both of them.
        </p>
        <p>
          Before all of that, I spent six months at Axopen building software for
          nuclear power plant management — a good early lesson in what it means to
          write code where being wrong is not an option.
        </p>
      </div>
    </div>
  );
}
