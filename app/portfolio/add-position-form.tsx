"use client";

import { useActionState } from "react";
import Card from "../components/card";
import { addPositionAction, type PositionFormState } from "./actions";

const initialState: PositionFormState = {};

const inputClasses =
  "mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink focus:border-primary-600 focus:outline-none";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-ink/50";

export default function AddPositionForm() {
  const [state, formAction, pending] = useActionState(addPositionAction, initialState);

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-ink">Add a position</h3>
      <p className="mt-1 text-xs text-ink/50">
        Company name, logo, and live price are fetched automatically from the ticker.
      </p>
      <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ticker" className={labelClasses}>
            Ticker
          </label>
          <input
            id="ticker"
            name="ticker"
            required
            maxLength={10}
            placeholder="AAPL"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="shares" className={labelClasses}>
            Shares
          </label>
          <input
            id="shares"
            name="shares"
            type="number"
            step="any"
            min="0"
            required
            placeholder="10"
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="avgCost" className={labelClasses}>
            Avg cost
          </label>
          <input
            id="avgCost"
            name="avgCost"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="150.00"
            className={inputClasses}
          />
        </div>

        {state.error ? <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p> : null}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add position"}
          </button>
        </div>
      </form>
    </Card>
  );
}
