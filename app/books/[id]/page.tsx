import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "../../components/card";
import FallbackImage from "../../components/fallback-image";
import SectionHeading from "../../components/section-heading";
import BookReview from "./book-review";
import { getBook } from "../../lib/books";
import { isAuthenticated } from "../../lib/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = Number.isFinite(Number(id)) ? await getBook(Number(id)) : null;
  return { title: book ? `${book.title} — Luca Savio` : "Book not found — Luca Savio" };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const [book, authed] = await Promise.all([
    Number.isFinite(numericId) ? getBook(numericId) : Promise.resolve(null),
    isAuthenticated(),
  ]);

  if (!book) notFound();

  return (
    <div className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <Link
        href="/books"
        className="text-xs font-semibold uppercase tracking-wide text-ink/30 transition-colors hover:text-ink/50"
      >
        ← All books
      </Link>

      <div className="mt-6">
        <SectionHeading label="Book" title={book.title} />
      </div>

      <Card className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        {book.photo ? (
          <FallbackImage
            src={book.photo}
            alt=""
            className="h-56 w-40 shrink-0 rounded-lg object-cover"
          />
        ) : null}
        <div>
          <p className="text-sm text-ink/50">{book.author}</p>

          {book.summary ? (
            <p className="mt-4 whitespace-pre-line text-sm text-ink/70">{book.summary}</p>
          ) : null}

          <BookReview book={book} editable={authed} />
        </div>
      </Card>
    </div>
  );
}
