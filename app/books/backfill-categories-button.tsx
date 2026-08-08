"use client";

import { useActionState } from "react";
import { backfillBookCategoriesAction, type BackfillState } from "./actions";

const initialState: BackfillState = {};

export default function BackfillCategoriesButton() {
  const [state, formAction, pending] = useActionState(backfillBookCategoriesAction, initialState);

  return (
    <form action={formAction} className="flex items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-semibold uppercase tracking-wide text-ink/50 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Fetching categories…" : "Fetch missing categories"}
      </button>
      {state.error ? <p className="text-xs text-red-600">{state.error}</p> : null}
      {state.message ? <p className="text-xs text-ink/50">{state.message}</p> : null}
    </form>
  );
}
