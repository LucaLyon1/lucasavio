import { notFound } from "next/navigation";
import SectionEyebrow from "@/components/section-eyebrow";
import Badge from "@/components/badge";
import MetricsTable from "@/components/metrics-table";
import EquityCurve from "@/components/equity-curve";
import { writeUps, getWriteUp, type WriteUp } from "@/lib/projects";

export function generateStaticParams() {
  return writeUps.map((p) => ({ slug: p.slug }));
}

const sectionsBeforeResults: { heading: string; key: keyof WriteUp }[] = [
  { heading: "Motivation", key: "motivation" },
  { heading: "Data", key: "dataSources" },
  { heading: "Methodology", key: "methodology" },
  { heading: "Backtest design", key: "backtestDesign" },
];

const sectionsAfterResults: { heading: string; key: keyof WriteUp }[] = [
  { heading: "Robustness checks", key: "robustness" },
  { heading: "Limitations", key: "limitations" },
];

function TextSection({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="mt-12">
      <h2 className="mb-3 font-sans text-xl font-bold text-strat-text">{heading}</h2>
      <p className="font-sans text-base font-light text-strat-muted">{body}</p>
    </section>
  );
}

export default async function WriteUpPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeUp = getWriteUp(slug);
  if (!writeUp) notFound();

  return (
    <div className="mx-auto max-w-175 px-6 py-24 sm:px-8">
      <SectionEyebrow>{writeUp.tag}</SectionEyebrow>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-sans text-3xl font-bold text-strat-text">{writeUp.title}</h1>
        <Badge>{writeUp.status}</Badge>
      </div>
      <p className="mt-4 max-w-xl font-sans text-base font-light text-strat-muted">
        {writeUp.summary}
      </p>

      {!writeUp.results && (
        <div className="mt-10 rounded-2xl border border-strat-gold/30 bg-strat-gold/10 px-6 py-4">
          <p className="font-sans text-sm font-medium text-strat-gold">
            Research in progress — results, charts, and the risk-metrics table will be
            published here once the backtest is complete. No performance numbers below
            are placeholders; this page only carries what&apos;s already decided.
          </p>
        </div>
      )}

      {sectionsBeforeResults.map((section) => (
        <TextSection
          key={section.key}
          heading={section.heading}
          body={writeUp[section.key] as string}
        />
      ))}

      {writeUp.results && (
        <section className="mt-12">
          <h2 className="mb-3 font-sans text-xl font-bold text-strat-text">Results</h2>
          <MetricsTable metrics={writeUp.results.metrics} />
          <div className="mt-8">
            <EquityCurve
              series={writeUp.results.equityCurve}
              xLabels={writeUp.results.xLabels}
            />
          </div>
        </section>
      )}

      {sectionsAfterResults.map((section) => (
        <TextSection
          key={section.key}
          heading={section.heading}
          body={writeUp[section.key] as string}
        />
      ))}
    </div>
  );
}
