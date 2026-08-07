"use client";

import { useActionState } from "react";
import Card from "../components/card";
import { loginAction, type LoginFormState } from "./actions";

const initialState: LoginFormState = {};

const inputClasses =
  "mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink focus:border-primary-600 focus:outline-none";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-ink/50";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <Card className="p-6">
      <h1 className="text-sm font-semibold text-ink">Sign in</h1>
      <form action={formAction} className="mt-4 grid gap-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <label htmlFor="password" className={labelClasses}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className={inputClasses}
          />
        </div>

        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

        <div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </Card>
  );
}
