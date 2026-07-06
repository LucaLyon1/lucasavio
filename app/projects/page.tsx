import SectionEyebrow from "@/components/section-eyebrow";
import ProjectCard from "@/components/project-card";
import { writeUps } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-275 px-6 py-24 sm:px-8">
      <SectionEyebrow>Projects</SectionEyebrow>
      <h1 className="font-sans text-3xl font-bold text-strat-text">
        A short, curated list
      </h1>
      <p className="mt-4 max-w-xl font-sans text-base font-light text-strat-muted">
        Pinned on purpose — one engineering flagship and the quant research write-ups
        I&apos;m building out, rather than an exhaustive archive.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <ProjectCard
          href="/projects/tradeflow"
          tag="Engineering"
          title="Tradeflow"
          description="A full-stack trading-strategy SaaS: visual strategy builder, backtest engine, Monte Carlo simulation, and market-data pipeline."
          metricLabel="Commits"
          metricValue="13+"
          featured
        />
        {writeUps.map((p) => (
          <ProjectCard
            key={p.slug}
            href={`/projects/${p.slug}`}
            tag={p.tag}
            title={p.title}
            description={p.summary}
            metricLabel={p.cardMetricLabel}
            metricValue={p.cardMetricValue}
          />
        ))}
      </div>
    </div>
  );
}
