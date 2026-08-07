import SectionHeading from "./section-heading";
import Button from "./button";
import PositionsTable from "./positions-table";
import type { PositionWithPerformance } from "../lib/positions";

export default function LivePositions({
  positions,
}: {
  positions: PositionWithPerformance[];
}) {
  return (
    <section className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="Live positions" />

      <PositionsTable positions={positions} />

      <p className="mt-4 text-xs text-ink/50">
        Placeholder data pending a live brokerage feed. Figures are illustrative, not real
        holdings.
      </p>

      <div className="mt-6">
        <Button href="/portfolio" variant="ghost">
          View full portfolio →
        </Button>
      </div>
    </section>
  );
}
