import Link from "next/link";
import SectionEyebrow from "@/components/section-eyebrow";
import ProjectCard from "@/components/project-card";
import { getWriteUp } from "@/lib/projects";

export default function Home() {
  const pairsTrading = getWriteUp("pairs-trading")!;
  return (
    <div className="mx-auto max-w-275 px-6 py-24 sm:px-8">
      <SectionEyebrow>Quantitative research &amp; trading</SectionEyebrow>
      <h1 className="max-w-2xl font-sans text-4xl font-bold text-strat-text sm:text-5xl">
        I build and test systematic trading strategies —{" "}
        <span className="italic text-strat-accent">and I show my work.</span>
      </h1>
      <p className="mt-6 max-w-xl font-sans text-base font-light text-strat-muted">
        Three years modeling M&amp;A deals and IFRS valuations (DCF, multiples, Monte
        Carlo) at ATRIOM, an engineering degree in statistics and linear algebra, and a
        company I founded and sold. Now pointed at markets: real backtests, honest
        limitations, and one strategy trading on a live paper account right now.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/live"
          className="rounded-lg bg-strat-accent px-7 py-3.5 font-sans font-semibold text-strat-bg hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-strat-accent focus-visible:ring-offset-2 focus-visible:ring-offset-strat-bg"
        >
          See the live strategy
        </Link>
        <Link
          href="/resume"
          className="rounded-lg border border-black/13 px-7 py-3.5 font-sans font-semibold text-strat-text hover:border-strat-accent hover:text-strat-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-strat-accent focus-visible:ring-offset-2 focus-visible:ring-offset-strat-bg"
        >
          View resume
        </Link>
      </div>

      <div className="mt-24">
        <SectionEyebrow>Pinned work</SectionEyebrow>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            href="/projects/tradeflow"
            tag="Engineering"
            title="Tradeflow"
            description="A full-stack trading-strategy SaaS: visual strategy builder, backtest engine, Monte Carlo simulation, and market-data pipeline — built end to end."
            metricLabel="Commits"
            metricValue="13+"
            featured
          />
          <ProjectCard
            href="/projects/pairs-trading"
            tag={pairsTrading.tag}
            title={pairsTrading.title}
            description={pairsTrading.summary}
            metricLabel={pairsTrading.cardMetricLabel}
            metricValue={pairsTrading.cardMetricValue}
          />
          <ProjectCard
            href="/live"
            tag="Live"
            title="Systematic equity strategy"
            description="A vol-adjusted momentum strategy paper-traded daily through a real broker sandbox, with a public, continuously updating track record."
            metricLabel="Status"
            metricValue="Launching"
          />
        </div>
      </div>
    </div>
  );
}
