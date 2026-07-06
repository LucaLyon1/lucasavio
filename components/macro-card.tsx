import MacroChart from "@/components/macro-chart";
import type { Band, Indicator } from "@/lib/macro-indicators";

function formatValue(value: number, unit: string): string {
  const decimals = Math.abs(value) >= 100 ? 0 : 2;
  return `${value.toFixed(decimals)}${unit}`;
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export function MacroCard({
  indicator,
  recessionBands,
}: {
  indicator: Indicator;
  recessionBands: Band[];
}) {
  const startYear = indicator.points[0]?.date.slice(0, 4);

  return (
    <div className="rounded-2xl border border-black/13 bg-strat-bg3 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-sans text-base font-semibold text-strat-text">{indicator.label}</h3>
        <span className="font-mono text-[0.7rem] text-strat-muted">as of {formatDate(indicator.asOf)}</span>
      </div>

      <div className="mt-1 font-mono text-2xl text-strat-text">
        {formatValue(indicator.current, indicator.unit)}
      </div>
      <p className="mt-1 font-sans text-xs font-light text-strat-muted">
        Higher than {indicator.percentileRank}% of readings since {startYear}
      </p>

      <div className="mt-4">
        <MacroChart points={indicator.points} recessionBands={recessionBands} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-black/8 pt-3">
        <a
          href={indicator.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[0.68rem] uppercase tracking-widest text-strat-muted hover:text-strat-accent"
        >
          {indicator.source}
        </a>
      </div>
      {indicator.caveat && (
        <p className="mt-2 font-sans text-[0.7rem] font-light italic text-strat-muted">{indicator.caveat}</p>
      )}
    </div>
  );
}

export function MacroCardUnavailable({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-black/13 bg-strat-bg3 p-6">
      <h3 className="font-sans text-base font-semibold text-strat-text">{label}</h3>
      <p className="mt-4 font-sans text-sm font-light text-strat-muted">
        Data temporarily unavailable — check back shortly.
      </p>
    </div>
  );
}
