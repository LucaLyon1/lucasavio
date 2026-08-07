"use client";

import { useActionState } from "react";
import Card from "../components/card";
import { addBookAction, type BookFormState } from "./actions";

const initialState: BookFormState = {};

const inputClasses =
  "mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink focus:border-primary-600 focus:outline-none";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-ink/50";

export default function AddBookForm() {
  const [state, formAction, pending] = useActionState(addBookAction, initialState);

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-ink">Add a book</h3>
      <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClasses}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="The Psychology of Money"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="author" className={labelClasses}>
            Author
          </label>
          <input
            id="author"
            name="author"
            required
            placeholder="Morgan Housel"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="grade" className={labelClasses}>
            Grade (out of 10)
          </label>
          <input
            id="grade"
            name="grade"
            type="number"
            step="0.5"
            min="0"
            max="10"
            required
            placeholder="8.5"
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="photo" className={labelClasses}>
            Cover photo URL
          </label>
          <input
            id="photo"
            name="photo"
            type="url"
            placeholder="https://covers.openlibrary.org/b/isbn/..."
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="summary" className={labelClasses}>
            Quick summary
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={2}
            placeholder="What the book is about, in a sentence or two."
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="review" className={labelClasses}>
            Review / analysis
          </label>
          <textarea
            id="review"
            name="review"
            rows={4}
            placeholder="Your full take on it."
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
            {pending ? "Adding…" : "Add book"}
          </button>
        </div>
      </form>
    </Card>
  );
}
