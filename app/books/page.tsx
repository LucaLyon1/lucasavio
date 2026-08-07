import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "../components/section-heading";
import BooksTable from "../components/books-table";
import AddBookForm from "./add-book-form";
import LogoutButton from "../login/logout-button";
import { getBooks } from "../lib/books";
import { isAuthenticated } from "../lib/auth";

export const metadata: Metadata = {
  title: "Books — Luca Savio",
};

export default async function BooksPage() {
  const [books, authed] = await Promise.all([getBooks(), isAuthenticated()]);

  return (
    <div className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <SectionHeading label="Books" title="Books read" />

      <BooksTable books={books} />

      <div className="mt-12 max-w-xl">
        {authed ? (
          <>
            <AddBookForm />
            <div className="mt-4 text-right">
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
