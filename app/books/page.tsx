import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "../components/section-heading";
import BooksTable from "../components/books-table";
import AddBookForm from "./add-book-form";
import BackfillCategoriesButton from "./backfill-categories-button";
import LogoutButton from "../login/logout-button";
import { getBooks, getBooksMissingCategories } from "../lib/books";
import { isAuthenticated } from "../lib/auth";

export const metadata: Metadata = {
  title: "Books — Luca Savio",
};

export default async function BooksPage() {
  const [books, authed, booksMissingCategories] = await Promise.all([
    getBooks(),
    isAuthenticated(),
    getBooksMissingCategories(),
  ]);

  return (
    <div className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <SectionHeading label="Books" title="Books read" />

      <p className="-mt-4 mb-8 text-sm text-ink/50">
        Click on a book to get my full analysis of it.
      </p>

      <BooksTable books={books} />

      <div className="mt-12 max-w-xl">
        {authed ? (
          <>
            <AddBookForm />
            <div className="mt-4 flex items-center justify-between">
              {booksMissingCategories.length > 0 ? <BackfillCategoriesButton /> : <span />}
              <LogoutButton />
            </div>
          </>
        ) : (
          <Link
            href="/login?redirectTo=/books"
            className="text-xs font-semibold uppercase tracking-wide text-ink/30 transition-colors hover:text-ink/50"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
