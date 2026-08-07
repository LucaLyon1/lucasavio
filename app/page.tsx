import Nav from "./components/nav";
import Hero from "./components/hero";
import LivePositions from "./components/live-positions";
import Articles from "./components/articles";
import About from "./components/about";
import BooksRead from "./components/books-read";
import Contact from "./components/contact";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <LivePositions />
        <Articles />
        <About />
        <BooksRead />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
