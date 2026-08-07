import SectionHeading from "./section-heading";
import Button from "./button";
import BooksTable from "./books-table";
import type { Book } from "../lib/books";

export default function BooksRead({ books }: { books: Book[] }) {
  return (
    <section className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="Books read" />

      <BooksTable books={books} />

      <div className="mt-6">
        <Button href="/books" variant="ghost">
          All books →
        </Button>
      </div>
    </section>
  );
}
