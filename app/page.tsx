import Hero from "./components/hero";
import LivePositions from "./components/live-positions";
import Chess from "./components/chess";
import Articles from "./components/articles";
import About from "./components/about";
import BooksRead from "./components/books-read";
import Contact from "./components/contact";
import { getPositions, getPricesAsOf } from "./lib/positions";
import { getBooks } from "./lib/books";
import { fetchArticles } from "./lib/substack";
import { getChessRatings, getRecentGames } from "./lib/chess";

export default async function Home() {
  const [positions, pricesAsOf, books, articles, chessRatings, chessGames] = await Promise.all([
    getPositions(),
    getPricesAsOf(),
    getBooks(),
    fetchArticles(),
    getChessRatings(),
    getRecentGames(5),
  ]);

  return (
    <>
      <Hero />
      <LivePositions positions={positions.slice(0, 5)} pricesAsOf={pricesAsOf} />
      <Chess ratings={chessRatings} games={chessGames} />
      <Articles articles={articles.slice(0, 3)} />
      <About />
      <BooksRead books={books.slice(0, 5)} />
      <Contact />
    </>
  );
}
