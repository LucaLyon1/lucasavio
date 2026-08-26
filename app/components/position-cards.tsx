"use client";

import { useActionState, useEffect, useState } from "react";
import Card from "./card";
import FallbackImage from "./fallback-image";
import type { StockWithPerformance, EditableStock } from "../lib/positions";
import {
  deletePositionAction,
  updatePositionAction,
  type PositionFormState,
} from "../portfolio/actions";

const inputClasses =
  "w-full rounded-lg border border-border bg-bg px-2 py-1.5 text-sm text-ink focus:border-primary-600 focus:outline-none";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-ink/50";

const initialState: PositionFormState = {};

function PnlBadge({ label, pct }: { label: string; pct: number }) {
  const positive = pct >= 0;
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold ${
        positive ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"
      }`}
    >
      <span className="text-xs font-normal uppercase tracking-wide opacity-70">{label}</span>
      <span className="tabular-nums">
        {positive ? "+" : ""}
        {pct.toFixed(2)}%
      </span>
    </div>
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

function EditPositionCard({ stock, onDone }: { stock: EditableStock; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(updatePositionAction, initialState);

  useEffect(() => {
    if (!pending && state !== initialState && !state.error) {
      onDone();
    }
  }, [state, pending, onDone]);

  return (
    <Card className="p-5">
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="ticker" value={stock.ticker} />
        <p className="text-sm font-semibold text-ink">{stock.ticker}</p>
        <div>
          <label htmlFor={`shares-${stock.ticker}`} className={labelClasses}>
            Shares
          </label>
          <input
            id={`shares-${stock.ticker}`}
            name="shares"
            type="number"
            step="any"
            min="0"
            required
            defaultValue={stock.shares}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={`avgCost-${stock.ticker}`} className={labelClasses}>
            Avg cost
          </label>
          <input
            id={`avgCost-${stock.ticker}`}
            name="avgCost"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={stock.avgCost}
            className={inputClasses}
          />
        </div>

        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

        <div className="flex justify-end gap-4">
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
    </Card>
  );
}

export default function PositionCards({
  positions,
  editData,
  editable = false,
}: {
  positions: StockWithPerformance[];
  editData?: EditableStock[];
  editable?: boolean;
}) {
  const [editingTicker, setEditingTicker] = useState<string | null>(null);

  if (positions.length === 0) {
    return (
      <Card className="p-6 text-sm text-ink/50">No positions yet.</Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {positions.map((position) => {
        const editStock = editData?.find((s) => s.ticker === position.ticker);
        if (editable && editStock && editingTicker === position.ticker) {
          return (
            <EditPositionCard
              key={position.ticker}
              stock={editStock}
              onDone={() => setEditingTicker(null)}
            />
          );
        }

        return (
          <Card key={position.ticker} className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <FallbackImage
                src={position.logo}
                alt=""
                className="size-10 shrink-0 rounded-full bg-white object-contain"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{position.ticker}</p>
                <p className="truncate text-xs text-ink/50">{position.fullName}</p>
              </div>
            </div>

            <p className="line-clamp-3 text-sm text-ink/70">
              {position.summary ?? "No summary available."}
            </p>

            <div className="mt-auto grid grid-cols-2 gap-2">
              <PnlBadge label="Daily" pct={position.dailyPnlPct} />
              <PnlBadge label="Total" pct={position.totalPnlPct} />
            </div>

            {editable && editStock ? (
              <div className="flex items-center justify-end gap-4 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTicker(position.ticker)}
                  className="text-xs font-semibold uppercase tracking-wide text-ink/50 transition-colors hover:text-ink"
                >
                  Edit
                </button>
                <DeleteButton ticker={position.ticker} />
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
