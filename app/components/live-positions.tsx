import Card from "./card";
import SectionHeading from "./section-heading";
import { positions } from "../lib/data";

const formatUsd = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function LivePositions() {
  return (
    <section id="portfolio" className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="Live positions" />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <p className="text-sm font-semibold text-ink">Brokerage feed</p>
          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
            Placeholder data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                {["Ticker", "Shares", "Avg cost", "Last", "Market value", "P&L %"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink/50"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.ticker} className="border-b border-border last:border-b-0">
                  <td className="px-6 py-3 text-sm font-semibold text-ink">{position.ticker}</td>
                  <td className="tabular-nums px-6 py-3 text-sm text-ink/80">{position.shares}</td>
                  <td className="tabular-nums px-6 py-3 text-sm text-ink/80">
                    {formatUsd(position.avgCost)}
                  </td>
                  <td className="tabular-nums px-6 py-3 text-sm text-ink/80">
                    {formatUsd(position.last)}
                  </td>
                  <td className="tabular-nums px-6 py-3 text-sm text-ink/80">
                    {formatUsd(position.marketValue)}
                  </td>
                  <td
                    className={`tabular-nums px-6 py-3 text-sm font-semibold ${
                      position.pnlPct >= 0 ? "text-primary-700" : "text-ink/60"
                    }`}
                  >
                    {position.pnlPct >= 0 ? "+" : ""}
                    {position.pnlPct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs text-ink/50">
        Placeholder data pending a live brokerage feed. Figures are illustrative, not real
        holdings.
      </p>
    </section>
  );
}
