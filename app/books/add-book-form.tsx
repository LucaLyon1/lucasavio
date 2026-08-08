"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Card from "../components/card";
import FallbackImage from "../components/fallback-image";
import { addBookAction, searchBooksAction, type BookFormState } from "./actions";
import type { BookSuggestion } from "../lib/google-books";

const initialState: BookFormState = {};

const inputClasses =
  "mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink focus:border-primary-600 focus:outline-none";
const labelClasses = "text-xs font-semibold uppercase tracking-wide text-ink/50";

export default function AddBookForm() {
  const [state, formAction, pending] = useActionState(addBookAction, initialState);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const categoriesRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) return;

    let cancelled = false;
    const timeout = setTimeout(() => {
      searchBooksAction(query).then((results) => {
        if (!cancelled) setSuggestions(results);
      });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  const visibleSuggestions = query.trim().length < 3 ? [] : suggestions;

  function selectSuggestion(suggestion: BookSuggestion) {
    if (titleRef.current) titleRef.current.value = suggestion.title;
    if (authorRef.current) authorRef.current.value = suggestion.author;
    if (photoRef.current) photoRef.current.value = suggestion.photo ?? "";
    if (summaryRef.current) summaryRef.current.value = suggestion.summary ?? "";
    if (categoriesRef.current) categoriesRef.current.value = suggestion.categories.join(", ");
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-ink">Add a book</h3>
      <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="relative sm:col-span-2">
          <label htmlFor="title" className={labelClasses}>
            Title
          </label>
          <input
            id="title"
            name="title"
            ref={titleRef}
            required
            autoComplete="off"
            defaultValue=""
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(visibleSuggestions.length > 0)}
            placeholder="The Psychology of Money"
            className={inputClasses}
          />
          {open && visibleSuggestions.length > 0 ? (
            <ul className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-border bg-bg shadow-lg">
              {visibleSuggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectSuggestion(suggestion);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-primary/10"
                  >
                    {suggestion.photo ? (
                      <FallbackImage
                        src={suggestion.photo}
                        alt=""
                        className="h-10 w-7 shrink-0 rounded object-cover"
                      />
                    ) : null}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {suggestion.title}
                      </span>
                      <span className="block truncate text-xs text-ink/50">{suggestion.author}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div>
          <label htmlFor="author" className={labelClasses}>
            Author
          </label>
          <input
            id="author"
            name="author"
            ref={authorRef}
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
            Cover photo URL{" "}
            <span className="normal-case text-ink/30">(optional — auto-filled from Google Books)</span>
          </label>
          <input
            id="photo"
            name="photo"
            ref={photoRef}
            type="url"
            placeholder="Leave blank to fetch automatically"
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="summary" className={labelClasses}>
            Quick summary{" "}
            <span className="normal-case text-ink/30">(optional — auto-filled from Google Books)</span>
          </label>
          <textarea
            id="summary"
            name="summary"
            ref={summaryRef}
            rows={2}
            placeholder="Leave blank to fetch automatically"
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="categories" className={labelClasses}>
            Categories{" "}
            <span className="normal-case text-ink/30">
              (optional — auto-filled from Google Books, comma-separated)
            </span>
          </label>
          <input
            id="categories"
            name="categories"
            ref={categoriesRef}
            placeholder="Leave blank to fetch automatically"
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
