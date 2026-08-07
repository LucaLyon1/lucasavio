import Card from "./card";
import FallbackImage from "./fallback-image";
import type { StockWithPerformance } from "../lib/positions";

const formatUsd = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

function PnlCell({ value, pct }: { value: number; pct: number }) {
  const positive = value >= 0;
  return (
    <td
      className={`tabular-nums px-6 py-3 text-sm font-semibold ${
        positive ? "text-primary-700" : "text-ink/60"
      }`}
    >
      {positive ? "+" : ""}
      {formatUsd(value)}
      <span className="ml-1 font-normal text-ink/40">
        ({positive ? "+" : ""}
        {pct.toFixed(1)}%)
      </span>
    </td>
  );
}

export default function PositionsTable({
  positions,
}: {
  positions: StockWithPerformance[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <p className="text-sm font-semibold text-ink">Live positions</p>
        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
          Live market data
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-220 border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {["Stock", "Price", "Position size", "% of portfolio", "Daily P&L", "Total P&L"].map(
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
            {positions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-sm text-ink/50">
                  No positions yet.
                </td>
              </tr>
            ) : (
              positions.map((position) => (
                <tr key={position.ticker} className="border-b border-border last:border-b-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <FallbackImage
                        src={position.logo}
                        alt=""
                        className="size-8 shrink-0 rounded-full bg-white object-contain"
                      />
                      <div>
                        <p className="text-sm font-semibold text-ink">{position.ticker}</p>
                        <p className="text-xs text-ink/50">{position.fullName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="tabular-nums px-6 py-3 text-sm text-ink/80">
                    {formatUsd(position.price)}
                  </td>
                  <td className="tabular-nums px-6 py-3 text-sm text-ink/80">
                    {formatUsd(position.positionSize)}
                  </td>
                  <td className="tabular-nums px-6 py-3 text-sm text-ink/80">
                    {position.portfolioPct.toFixed(1)}%
                  </td>
                  <PnlCell value={position.dailyPnl} pct={position.dailyPnlPct} />
                  <PnlCell value={position.totalPnl} pct={position.totalPnlPct} />
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
