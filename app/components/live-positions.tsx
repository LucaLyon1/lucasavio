import SectionHeading from "./section-heading";
import Button from "./button";
import PositionCards from "./position-cards";
import { describePricesAsOf, type StockWithPerformance } from "../lib/positions";

export default function LivePositions({
  positions,
  pricesAsOf,
}: {
  positions: StockWithPerformance[];
  pricesAsOf: string | null;
}) {
  return (
    <section className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="Live positions" />

      <PositionCards positions={positions} />

      <p className="mt-4 text-xs text-ink/50">{describePricesAsOf(pricesAsOf)}</p>

      <div className="mt-6">
        <Button href="/portfolio" variant="ghost">
          View full portfolio →
        </Button>
      </div>
    </section>
  );
}
