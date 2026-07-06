import { EQUITY_XLABELS, EQUITY_STRATEGY, EQUITY_BENCHMARK } from "@/lib/pairs-trading-data";

export type WriteUp = {
  slug: string;
  title: string;
  tag: string;
  status: "In progress" | "Planned" | "Complete";
  cardMetricLabel: string;
  cardMetricValue: string;
  summary: string;
  motivation: string;
  dataSources: string;
  methodology: string;
  backtestDesign: string;
  robustness: string;
  limitations: string;
  repoUrl?: string;
  results?: {
    metrics: { label: string; value: string }[];
    equityCurve: { label: string; color: string; points: number[] }[];
    xLabels: string[];
  };
};

export const writeUps: WriteUp[] = [
  {
    slug: "pairs-trading",
    title: "Cointegration pairs trading",
    tag: "Quant research",
    status: "Complete",
    cardMetricLabel: "Sharpe",
    cardMetricValue: "0.20",
    summary:
      "Engle-Granger pair selection within one sector, walk-forward re-selection, and an honest comparison against buy-and-hold — including the finding that the edge is thin and cost-sensitive.",
    motivation:
      "Pairs trading is one of the most-studied statistical arbitrage strategies and a fair test of whether a spread's mean reversion holds up once selection bias and costs are accounted for.",
    dataSources:
      "Daily closing prices for 10 liquid large-cap US banks (JPM, BAC, WFC, C, GS, MS, USB, PNC, TFC, COF), 2015-2024, via Yahoo Finance. One sector, so any cointegration reflects shared rate/macro exposure rather than a coincidence.",
    methodology:
      "Engle-Granger two-step cointegration test on log prices, run on every pair in the universe (45 combinations) at each re-selection point. The 5 pairs with the lowest p-value below 0.05 are traded; the hedge ratio is fit by OLS on the same formation-window data. Positions are sized on the spread's z-score: enter beyond ±2.0, exit inside ±0.5, stop out beyond ±4.0.",
    backtestDesign:
      "Walk-forward: pairs are re-selected and the hedge ratio re-fit every 63 trading days (one quarter), using only the prior 252 days (one year) — nothing in a trading window ever influences the pair selection or hedge ratio applied to it. Positions are force-closed at the end of each quarter before re-selection. Costs are modeled explicitly: 5bps per leg per trade, plus a 30bps/year borrow cost on the short leg while a position is held — not assumed away.",
    robustness:
      "Entry threshold sensitivity (z = 1.5 / 2.0 / 2.5) keeps Sharpe in a 0.20-0.36 range — thin but not a knife-edge parameter choice. A 5x cost stress test flips the strategy negative (Sharpe -1.04, CAGR -5.5%), which says the edge is real but genuinely thin relative to trading frictions, not robust to them. Splitting by regime: the strategy lost money 2015-2019 (Sharpe -0.24), did well through the 2020 volatility spike (Sharpe 0.78), and was moderately positive after (Sharpe 0.33) — performance is concentrated in high-dispersion periods, not a steady year-round edge. As a leakage check, re-running the same pipeline but letting pair selection and the hedge ratio see the trading window itself (a deliberate look-ahead leak) pushes Sharpe to 1.91 — confirming the walk-forward split is doing real work, and that 0.20 is the honest number, not a bug suppressing it.",
    limitations:
      "Sharpe 0.20 is materially below the buy-and-hold benchmark's 0.55 over this window, on both an absolute and risk-adjusted basis — this strategy did not beat a naive long position here, even though its volatility (5.2%) and max drawdown (-9.2%) are far smaller than buy-and-hold's (28.8% / -50.2%). The universe is small and hand-picked (10 names, one sector), so there's real selection bias and correlated tail risk — the 2023 regional-banking stress is exactly the kind of event that hits every pair in this universe at once. Execution is modeled as same-day with flat per-trade costs; real slippage, short-borrow availability during stress, and wider bid-ask names aren't captured. Only 3 threshold values were checked, with no correction for testing multiple parameters.",
    results: {
      metrics: [
        { label: "CAGR (strategy)", value: "0.9%" },
        { label: "CAGR (buy & hold)", value: "12.5%" },
        { label: "Sharpe (strategy)", value: "0.20" },
        { label: "Sharpe (buy & hold)", value: "0.55" },
        { label: "Volatility (strategy)", value: "5.2%" },
        { label: "Volatility (buy & hold)", value: "28.8%" },
        { label: "Max drawdown (strategy)", value: "-9.2%" },
        { label: "Max drawdown (buy & hold)", value: "-50.2%" },
      ],
      equityCurve: [
        { label: "Strategy", color: "#9333ea", points: EQUITY_STRATEGY },
        { label: "Buy & hold benchmark", color: "#64748b", points: EQUITY_BENCHMARK },
      ],
      xLabels: EQUITY_XLABELS,
    },
  },
  {
    slug: "vol-forecasting",
    title: "Volatility forecasting",
    tag: "Quant research",
    status: "Planned",
    cardMetricLabel: "Status",
    cardMetricValue: "Planned",
    summary:
      "GARCH-family models against a realized-volatility baseline, evaluated with expanding-window time-series cross-validation.",
    motivation:
      "Volatility forecasts sit underneath position sizing and risk management for almost every systematic strategy — worth getting the evaluation methodology right, not just the model.",
    dataSources: "Daily returns for a liquid index or ETF, with a long enough history for multiple volatility regimes.",
    methodology:
      "GARCH(1,1) and EGARCH forecasts compared against a simple realized-volatility baseline.",
    backtestDesign:
      "Expanding-window time-series cross-validation (never a random shuffle split) — each fold trains only on the past.",
    robustness: "Out-of-sample RMSE and QLIKE against the naive baseline, checked across different volatility regimes.",
    limitations: "To be written up alongside the results.",
  },
];

export function getWriteUp(slug: string) {
  return writeUps.find((p) => p.slug === slug);
}
