import type { SeriesPoint } from "@/lib/fred";
import type { Band } from "@/lib/macro-indicators";

type MacroChartProps = {
  points: SeriesPoint[];
  recessionBands?: Band[];
  color?: string;
  height?: number;
};

const VIEW_WIDTH = 600;

function percentile(sortedValues: number[], p: number): number {
  const idx = (sortedValues.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedValues[lo];
  return sortedValues[lo] + (sortedValues[hi] - sortedValues[lo]) * (idx - lo);
}

function toX(i: number, count: number): number {
  return count <= 1 ? 0 : (i / (count - 1)) * VIEW_WIDTH;
}

function toY(value: number, min: number, max: number, height: number): number {
  const span = max - min || 1;
  return height - ((value - min) / span) * height;
}

/** Index of the last point with date <= target, for placing recession bands on the index-based x-axis. */
function indexAtOrBefore(points: SeriesPoint[], target: string): number {
  let result = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i].date <= target) result = i;
    else break;
  }
  return result;
}

function yearLabels(points: SeriesPoint[], count = 5): { x: number; label: string }[] {
  if (points.length === 0) return [];
  const step = (points.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const idx = Math.round(i * step);
    return { x: toX(idx, points.length), label: points[idx].date.slice(0, 4) };
  });
}

export default function MacroChart({ points, recessionBands = [], color = "#9333ea", height = 160 }: MacroChartProps) {
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sorted = [...values].sort((a, b) => a - b);
  const p10 = percentile(sorted, 0.1);
  const p90 = percentile(sorted, 0.9);
  const median = percentile(sorted, 0.5);

  const linePath = points
    .map((point, i) => {
      const x = toX(i, points.length);
      const y = toY(point.value, min, max, height);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const lastX = toX(points.length - 1, points.length);
  const lastY = toY(values[values.length - 1], min, max, height);
  const labels = yearLabels(points);

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        role="img"
        aria-label="Historical time series chart"
        className="w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {recessionBands.map((band, i) => {
          const startX = toX(indexAtOrBefore(points, band.start), points.length);
          const endX = toX(indexAtOrBefore(points, band.end), points.length);
          if (endX <= startX) return null;
          return (
            <rect
              key={i}
              x={startX}
              y={0}
              width={endX - startX}
              height={height}
              fill="rgba(26,21,35,0.06)"
            />
          );
        })}

        <rect
          x={0}
          y={toY(p90, min, max, height)}
          width={VIEW_WIDTH}
          height={Math.max(0, toY(p10, min, max, height) - toY(p90, min, max, height))}
          fill={color}
          fillOpacity={0.08}
        />
        <line
          x1={0}
          x2={VIEW_WIDTH}
          y1={toY(median, min, max, height)}
          y2={toY(median, min, max, height)}
          stroke={color}
          strokeOpacity={0.35}
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastX} cy={lastY} r={3} fill={color} />
      </svg>

      <div className="relative mt-2 h-4 font-mono text-[0.72rem] text-strat-muted">
        {labels.map((label, i) => (
          <span
            key={i}
            className="absolute -translate-x-1/2"
            style={{ left: `${(label.x / VIEW_WIDTH) * 100}%` }}
          >
            {label.label}
          </span>
        ))}
      </div>

      {/* A full per-point data table isn't useful read aloud for series with
          thousands of points (and, via a table-height CSS quirk, silently
          breaks page layout) — a short text summary instead. */}
      <p className="sr-only">
        Time series of {points.length} readings from {points[0]?.date} to{" "}
        {points[points.length - 1]?.date}, ranging from {min.toFixed(2)} to {max.toFixed(2)}, most
        recently {values[values.length - 1].toFixed(2)}.
      </p>
    </div>
  );
}
