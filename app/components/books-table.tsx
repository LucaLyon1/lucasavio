import Link from "next/link";
import Card from "./card";
import FallbackImage from "./fallback-image";
import type { Book } from "../lib/books";

export default function BooksTable({ books }: { books: Book[] }) {
  return (
    <Card>
      <table className="w-full min-w-160 border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            {["Book", "Summary", "Grade"].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink/50"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-6 text-sm text-ink/50">
                No books logged yet.
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr
                key={book.id}
                className="relative border-b border-border last:border-b-0 hover:bg-primary/5"
              >
                <td className="px-6 py-3">
                  <Link
                    href={`/books/${book.id}`}
                    className="absolute inset-0"
                    aria-label={`${book.title} by ${book.author}`}
                  />
                  <div className="flex items-center gap-3">
                    {book.photo ? (
                      <FallbackImage
                        src={book.photo}
                        alt=""
                        className="h-14 w-10 shrink-0 rounded object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="text-sm font-medium text-ink">{book.title}</p>
                      <p className="text-xs text-ink/50">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="max-w-xs px-6 py-3 text-sm text-ink/70">
                  {book.summary ? (
                    <span className="line-clamp-2">{book.summary}</span>
                  ) : (
                    <span className="text-ink/30">—</span>
                  )}
                </td>
                <td className="tabular-nums px-6 py-3 text-sm font-semibold text-primary-700">
                  {book.grade.toFixed(1)}
                  <span className="font-normal text-ink/40">/10</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}
