import Button from "./button";

export default function Hero() {
  return (
    <section className="mx-auto max-w-300 px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
        Investor · Engineer · Writer
      </p>
      <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-ink sm:text-7xl">
        Luca Savio
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
        I build software, invest in public markets, and write down what I learn
        along the way.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/portfolio" variant="primary">
          View portfolio
        </Button>
        <Button href="/articles" variant="secondary">
          Read articles
        </Button>
      </div>
    </section>
  );
}
