import Card from "./card";
import SectionHeading from "./section-heading";
import { books } from "../lib/data";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-primary-600" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-ink/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function BooksRead() {
  return (
    <section id="books" className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="Books read" />

      <Card>
        <table className="w-full min-w-140 border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {["Title", "Author", "Category", "Rating"].map((heading) => (
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
            {books.map((book) => (
              <tr key={book.title} className="border-b border-border last:border-b-0">
                <td className="px-6 py-3 text-sm font-medium text-ink">{book.title}</td>
                <td className="px-6 py-3 text-sm text-ink/70">{book.author}</td>
                <td className="px-6 py-3">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                    {book.category}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm">
                  <Stars rating={book.rating} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
