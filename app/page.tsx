import Hero from "./components/hero";
import LivePositions from "./components/live-positions";
import Articles from "./components/articles";
import About from "./components/about";
import BooksRead from "./components/books-read";
import Contact from "./components/contact";
import { getPositions, getPricesAsOf } from "./lib/positions";
import { getBooks } from "./lib/books";
import { fetchArticles } from "./lib/substack";

export default async function Home() {
  const [positions, pricesAsOf, books, articles] = await Promise.all([
    getPositions(),
    getPricesAsOf(),
    getBooks(),
    fetchArticles(),
  ]);

  return (
    <>
      <Hero />
      <LivePositions positions={positions.slice(0, 5)} pricesAsOf={pricesAsOf} />
      <Articles articles={articles.slice(0, 3)} />
      <About />
      <BooksRead books={books.slice(0, 5)} />
      <Contact />
    </>
  );
}
