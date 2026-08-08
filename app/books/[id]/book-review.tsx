"use client";

import { useActionState, useEffect, useState } from "react";
import { updateBookReviewAction, type BookFormState } from "../actions";
import type { Book } from "../../lib/books";

const inputClasses =
  "mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink focus:border-primary-600 focus:outline-none";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-ink/50";

const initialState: BookFormState = {};

function EditBookReviewForm({ book, onDone }: { book: Book; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(updateBookReviewAction, initialState);

  useEffect(() => {
    if (!pending && state !== initialState && !state.error) {
      onDone();
    }
  }, [state, pending, onDone]);

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="id" value={book.id} />
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
          defaultValue={book.grade}
          className={inputClasses}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="categories" className={labelClasses}>
          Categories <span className="normal-case text-ink/30">(comma-separated)</span>
        </label>
        <input
          id="categories"
          name="categories"
          defaultValue={book.categories.join(", ")}
          placeholder="Fiction, Thrillers"
          className={inputClasses}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="review" className={labelClasses}>
          Review / analysis
        </label>
        <textarea
          id="review"
          name="review"
          rows={6}
          defaultValue={book.review ?? ""}
          placeholder="Your full take on it."
          className={inputClasses}
        />
      </div>

      {state.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-4 flex gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-xs font-semibold uppercase tracking-wide text-ink/50 transition-colors hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function BookReview({ book, editable }: { book: Book; editable: boolean }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <EditBookReviewForm book={book} onDone={() => setEditing(false)} />;
  }

  return (
    <>
      <div className="mt-1 flex items-center gap-3">
        <p className="text-sm font-semibold text-primary-700">
          {book.grade.toFixed(1)}
          <span className="font-normal text-ink/40">/10</span>
        </p>
        {editable ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-semibold uppercase tracking-wide text-ink/50 transition-colors hover:text-ink"
          >
            Edit
          </button>
        ) : null}
      </div>

      {book.categories.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {book.categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-700"
            >
              {category}
            </span>
          ))}
        </div>
      ) : null}

      {book.review ? (
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Review</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/80">
            {book.review}
          </p>
        </div>
      ) : null}
    </>
  );
}
