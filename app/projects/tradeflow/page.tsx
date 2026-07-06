import SectionEyebrow from "@/components/section-eyebrow";
import Badge from "@/components/badge";

const stack = [
  "Next.js 15 (App Router) + React 19 + TypeScript",
  "Tailwind CSS v4 + shadcn/ui",
  "Supabase (Auth) + Drizzle ORM (Postgres)",
  "@xyflow/react — the strategy diagram canvas",
  "technicalindicators — SMA, EMA, RSI, MACD, Bollinger, ATR",
  "yahoo-finance2 — OHLCV market data, behind a provider interface",
];

export default function TradeflowPage() {
  return (
    <div className="mx-auto max-w-175 px-6 py-24 sm:px-8">
      <SectionEyebrow>Engineering · Case study</SectionEyebrow>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-sans text-3xl font-bold text-strat-text">Tradeflow</h1>
        <Badge>In development</Badge>
      </div>
      <p className="mt-4 max-w-xl font-sans text-base font-light text-strat-muted">
        A trading-strategy SaaS: design a strategy on a visual diagram, run a
        historical backtest against it, and review standard performance analytics —
        no code required to use it, real engineering required to build it.
      </p>

      <section className="mt-14">
        <h2 className="mb-4 font-sans text-xl font-bold text-strat-text">
          What it does
        </h2>
        <p className="font-sans text-base font-light text-strat-muted">
          Users compose a strategy from blocks on a node-based canvas — data
          sources, technical indicators, entry/exit conditions, risk rules — and run
          it against historical OHLCV data. The result is a standard analytics view:
          equity curve, key risk metrics, and a monthly-return heatmap, the same
          shape of output a research desk would expect from a backtest report.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 font-sans text-xl font-bold text-strat-text">
          Backtest engine &amp; Monte Carlo
        </h2>
        <p className="font-sans text-base font-light text-strat-muted">
          The strategy graph is compiled into an executable form (
          <code className="font-mono text-strat-accent2">lib/backtest/compile.ts</code>
          ), then simulated bar-by-bar (
          <code className="font-mono text-strat-accent2">lib/backtest/run.ts</code>
          ) with standard metrics computed independently (
          <code className="font-mono text-strat-accent2">lib/backtest/metrics.ts</code>
          ) so scoring logic stays decoupled from simulation logic. A Monte Carlo
          module (
          <code className="font-mono text-strat-accent2">lib/backtest/monte-carlo.ts</code>
          ) resamples trade sequences to show a distribution of outcomes, not just the
          one historical path — the same instinct for &quot;how fragile is this
          number&quot; that IFRS valuation work requires.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 font-sans text-xl font-bold text-strat-text">
          Market data
        </h2>
        <p className="font-sans text-base font-light text-strat-muted">
          Market data sits behind a provider interface (
          <code className="font-mono text-strat-accent2">lib/market-data/provider.ts</code>
          ) rather than being called directly, so the Yahoo Finance implementation
          used today can be swapped for another vendor without touching the backtest
          engine. Results are cached in Postgres to cut outbound calls and keep
          repeat backtests fast.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 font-sans text-xl font-bold text-strat-text">Stack</h2>
        <ul className="flex flex-col gap-2">
          {stack.map((item) => (
            <li key={item} className="font-mono text-sm text-strat-muted">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-2xl border border-black/13 bg-strat-bg3 p-7">
        <h2 className="mb-2 font-sans text-lg font-semibold text-strat-text">
          Live demo
        </h2>
        <p className="font-sans text-sm font-light text-strat-muted">
          A public read-only demo is planned — for now, reach out and I&apos;ll walk
          through it directly.
        </p>
      </section>
    </div>
  );
}
