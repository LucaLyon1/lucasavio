import SectionEyebrow from "@/components/section-eyebrow";
import Badge from "@/components/badge";
import { MacroCard, MacroCardUnavailable } from "@/components/macro-card";
import {
  getBuffettIndicator,
  getHighYieldSpread,
  getRecessionBands,
  getShillerCapeIndicator,
  getSpToM2,
  getTobinsQ,
  getVix,
  getYieldCurve,
  type Indicator,
} from "@/lib/macro-indicators";

async function loadDashboard() {
  const [cape, buffett, tobinsQ, yieldCurve, spToM2, vix, hySpread, recessionBands] =
    await Promise.allSettled([
      getShillerCapeIndicator(),
      getBuffettIndicator(),
      getTobinsQ(),
      getYieldCurve(),
      getSpToM2(),
      getVix(),
      getHighYieldSpread(),
      getRecessionBands(),
    ]);

  const bands = recessionBands.status === "fulfilled" ? recessionBands.value : [];
  const indicators: { label: string; result: PromiseSettledResult<Indicator> }[] = [
    { label: "Shiller CAPE", result: cape },
    { label: "Buffett Indicator", result: buffett },
    { label: "Tobin's Q", result: tobinsQ },
    { label: "Yield curve (10Y − 2Y)", result: yieldCurve },
    { label: "S&P 500 / M2", result: spToM2 },
    { label: "VIX", result: vix },
    { label: "High-yield credit spread", result: hySpread },
  ];

  return { indicators, bands };
}

export default async function LivePage() {
  const { indicators, bands } = await loadDashboard();

  return (
    <div className="mx-auto max-w-275 px-6 py-24 sm:px-8">
      <SectionEyebrow>Live</SectionEyebrow>
      <h1 className="font-sans text-3xl font-bold text-strat-text">How I read the market</h1>
      <p className="mt-4 max-w-2xl font-sans text-base font-light text-strat-muted">
        Seven macro gauges I actually check before sizing risk, fetched live from FRED and
        Robert Shiller&apos;s public dataset — not screenshots, not a static snapshot.
        Percentile readouts are computed directly from each series&apos; own history, not
        opinion.
      </p>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        {indicators.map(({ label, result }) =>
          result.status === "fulfilled" ? (
            <MacroCard key={result.value.id} indicator={result.value} recessionBands={bands} />
          ) : (
            <MacroCardUnavailable key={label} label={label} />
          ),
        )}
      </section>

      <div className="mx-auto mt-20 max-w-175">
        <SectionEyebrow>Coming next</SectionEyebrow>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-sans text-3xl font-bold text-strat-text">
            Systematic equity strategy
          </h2>
          <Badge>Not yet trading</Badge>
        </div>
        <p className="mt-4 max-w-xl font-sans text-base font-light text-strat-muted">
          This page will show a live, continuously-updating track record — not a
          one-time backtest. It isn&apos;t live yet, so there&apos;s no chart here: a
          fabricated equity curve would defeat the entire point of this site.
        </p>

        <section className="mt-14">
          <h3 className="mb-4 font-sans text-xl font-bold text-strat-text">
            What&apos;s planned
          </h3>
          <ul className="flex flex-col gap-3 font-sans text-base font-light text-strat-muted">
            <li>
              A vol-adjusted momentum / short-term reversal signal, run daily after
              close over a fixed universe of ~50-100 liquid US equities.
            </li>
            <li>
              Orders submitted to a real broker paper-trading sandbox (Alpaca) — a real
              fill, not a self-simulated ledger.
            </li>
            <li>
              Positions, fills, and equity logged to a database every run, so
              &quot;updated Xh ago&quot; on this page reflects an actual row, not a
              static label.
            </li>
            <li>
              A separate, clearly labeled historical backtest (with a real train/test
              split and modeled transaction costs) shown alongside — and never blended
              into the live track record&apos;s numbers.
            </li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-black/13 bg-strat-bg3 p-7">
          <h3 className="mb-2 font-sans text-lg font-semibold text-strat-text">
            Follow along
          </h3>
          <p className="font-sans text-sm font-light text-strat-muted">
            Check back here once the strategy goes live, or{" "}
            <a href="/contact" className="text-strat-accent hover:underline">
              reach out
            </a>{" "}
            for a status update.
          </p>
        </section>
      </div>
    </div>
  );
}
