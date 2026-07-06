import SectionEyebrow from "@/components/section-eyebrow";
import Badge from "@/components/badge";

export default function LivePage() {
  return (
    <div className="mx-auto max-w-175 px-6 py-24 sm:px-8">
      <SectionEyebrow>Live</SectionEyebrow>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-sans text-3xl font-bold text-strat-text">
          Systematic equity strategy
        </h1>
        <Badge>Not yet trading</Badge>
      </div>
      <p className="mt-4 max-w-xl font-sans text-base font-light text-strat-muted">
        This page will show a live, continuously-updating track record — not a
        one-time backtest. It isn&apos;t live yet, so there&apos;s no chart here: a
        fabricated equity curve would defeat the entire point of this site.
      </p>

      <section className="mt-14">
        <h2 className="mb-4 font-sans text-xl font-bold text-strat-text">
          What&apos;s planned
        </h2>
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
        <h2 className="mb-2 font-sans text-lg font-semibold text-strat-text">
          Follow along
        </h2>
        <p className="font-sans text-sm font-light text-strat-muted">
          Check back here once the strategy goes live, or{" "}
          <a href="/contact" className="text-strat-accent hover:underline">
            reach out
          </a>{" "}
          for a status update.
        </p>
      </section>
    </div>
  );
}
