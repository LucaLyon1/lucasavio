"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Card from "./card";
import FallbackImage from "./fallback-image";
import type { StockWithPerformance } from "../lib/positions";
import {
  deletePositionAction,
  updatePositionAction,
  type PositionFormState,
} from "../portfolio/actions";

const formatUsd = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatNative = (value: number, currency: string) => {
  try {
    return value.toLocaleString("en-US", { style: "currency", currency });
  } catch {
    // Unknown currency code — fall back to a plain number with the code appended.
    return `${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  }
};

const inputClasses =
  "w-full rounded-lg border border-border bg-bg px-2 py-1.5 text-sm text-ink focus:border-primary-600 focus:outline-none";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-ink/50";

const initialState: PositionFormState = {};

type SortKey = "ticker" | "price" | "positionSize" | "portfolioPct" | "dailyPnl" | "totalPnl";
type SortState = { key: SortKey; direction: "asc" | "desc" };

const columns: { key: SortKey; label: string }[] = [
  { key: "ticker", label: "Stock" },
  { key: "price", label: "Price" },
  { key: "positionSize", label: "Position size" },
  { key: "portfolioPct", label: "% of portfolio" },
  { key: "dailyPnl", label: "Daily P&L" },
  { key: "totalPnl", label: "Total P&L" },
];

function PnlCell({ value, pct }: { value: number; pct: number }) {
  const positive = value >= 0;
  return (
    <td
      className={`tabular-nums px-6 py-3 text-sm font-semibold ${
        positive ? "text-gain" : "text-loss"
      }`}
    >
      {positive ? "+" : ""}
      {formatUsd(value)}
      <span className="ml-1 font-normal opacity-70">
        ({positive ? "+" : ""}
        {pct.toFixed(1)}%)
      </span>
    </td>
  );
}

function DeleteButton({ ticker }: { ticker: string }) {
  return (
    <form
      action={deletePositionAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete your position in ${ticker}?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="ticker" value={ticker} />
      <button
        type="submit"
        className="text-xs font-semibold uppercase tracking-wide text-red-600/70 transition-colors hover:text-red-600"
      >
        Delete
      </button>
    </form>
  );
}

function EditPositionRow({
  position,
  colSpan,
  onDone,
}: {
  position: StockWithPerformance;
  colSpan: number;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(updatePositionAction, initialState);

  useEffect(() => {
    if (!pending && state !== initialState && !state.error) {
      onDone();
    }
  }, [state, pending, onDone]);

  return (
    <tr className="border-b border-border bg-primary-100/30 last:border-b-0">
      <td colSpan={colSpan} className="px-6 py-4">
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="ticker" value={position.ticker} />
          <div>
            <label htmlFor={`shares-${position.ticker}`} className={labelClasses}>
              Shares
            </label>
            <input
              id={`shares-${position.ticker}`}
              name="shares"
              type="number"
              step="any"
              min="0"
              required
              defaultValue={position.shares}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor={`avgCost-${position.ticker}`} className={labelClasses}>
              Avg cost
            </label>
            <input
              id={`avgCost-${position.ticker}`}
              name="avgCost"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={position.avgCost}
              className={inputClasses}
            />
          </div>

          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

          <div className="ml-auto flex gap-4">
            <button
              type="button"
              onClick={onDone}
              className="text-xs font-semibold uppercase tracking-wide text-ink/50 transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}

export default function PositionsTable({
  positions,
  editable = false,
  showTotal = true,
}: {
  positions: StockWithPerformance[];
  editable?: boolean;
  showTotal?: boolean;
}) {
  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState | null>(null);

  const totalPositionSize = positions.reduce((sum, p) => sum + p.positionSize, 0);
  const totalDailyPnl = positions.reduce((sum, p) => sum + p.dailyPnl, 0);
  const totalPnl = positions.reduce((sum, p) => sum + p.totalPnl, 0);
  const totalPreviousValue = totalPositionSize - totalDailyPnl;
  const totalCostBasis = totalPositionSize - totalPnl;
  const totalDailyPnlPct = totalPreviousValue ? (totalDailyPnl / totalPreviousValue) * 100 : 0;
  const totalPnlPct = totalCostBasis ? (totalPnl / totalCostBasis) * 100 : 0;

  const sortedPositions = useMemo(() => {
    if (!sort) return positions;
    const sorted = [...positions].sort((a, b) =>
      sort.key === "ticker" ? a.ticker.localeCompare(b.ticker) : a[sort.key] - b[sort.key],
    );
    return sort.direction === "asc" ? sorted : sorted.reverse();
  }, [positions, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  }

  const columnCount = columns.length + (editable ? 1 : 0);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <p className="text-sm font-semibold text-ink">Live positions</p>
        <span className="text-xs text-ink/50">Refreshed daily after US market close</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-220 border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink/50"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className="flex items-center gap-1 transition-colors hover:text-ink"
                  >
                    {column.label}
                    {sort?.key === column.key ? (
                      <span aria-hidden="true">{sort.direction === "asc" ? "↑" : "↓"}</span>
                    ) : null}
                  </button>
                </th>
              ))}
              {editable ? (
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-6 py-6 text-sm text-ink/50">
                  No positions yet.
                </td>
              </tr>
            ) : (
              sortedPositions.map((position) =>
                editable && editingTicker === position.ticker ? (
                  <EditPositionRow
                    key={position.ticker}
                    position={position}
                    colSpan={columnCount}
                    onDone={() => setEditingTicker(null)}
                  />
                ) : (
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
                      {formatNative(position.price, position.currency)}
                      {position.currency !== "USD" ? (
                        <span className="ml-1 text-xs text-ink/40">{position.currency}</span>
                      ) : null}
                    </td>
                    <td className="tabular-nums px-6 py-3 text-sm text-ink/80">
                      {formatUsd(position.positionSize)}
                    </td>
                    <td className="tabular-nums px-6 py-3 text-sm text-ink/80">
                      {position.portfolioPct.toFixed(1)}%
                    </td>
                    <PnlCell value={position.dailyPnl} pct={position.dailyPnlPct} />
                    <PnlCell value={position.totalPnl} pct={position.totalPnlPct} />
                    {editable ? (
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setEditingTicker(position.ticker)}
                            className="text-xs font-semibold uppercase tracking-wide text-ink/50 transition-colors hover:text-ink"
                          >
                            Edit
                          </button>
                          <DeleteButton ticker={position.ticker} />
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ),
              )
            )}
          </tbody>
          {showTotal && positions.length > 0 ? (
            <tfoot>
              <tr className="border-t border-border bg-ink/3 font-semibold">
                <td className="px-6 py-3 text-sm text-ink">Total</td>
                <td className="px-6 py-3" />
                <td className="tabular-nums px-6 py-3 text-sm text-ink">
                  {formatUsd(totalPositionSize)}
                </td>
                <td className="tabular-nums px-6 py-3 text-sm text-ink">100.0%</td>
                <PnlCell value={totalDailyPnl} pct={totalDailyPnlPct} />
                <PnlCell value={totalPnl} pct={totalPnlPct} />
                {editable ? <td className="px-6 py-3" /> : null}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
    </Card>
  );
}
