import type { Metadata } from "next";
import SectionHeading from "../components/section-heading";
import BooksTable from "../components/books-table";
import AddBookForm from "./add-book-form";
import { getBooks } from "../lib/books";

export const metadata: Metadata = {
  title: "Books — Luca Savio",
};

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <SectionHeading label="Books" title="Books read" />

      <BooksTable books={books} />

      <div className="mt-12 max-w-xl">
        <AddBookForm />
      </div>
    </div>
  );
}
