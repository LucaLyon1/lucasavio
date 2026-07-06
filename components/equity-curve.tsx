type Series = {
  label: string;
  color: string;
  points: number[];
};

type EquityCurveProps = {
  series: Series[];
  xLabels?: string[];
  height?: number;
};

const VIEW_WIDTH = 600;

function toPath(points: number[], min: number, max: number, height: number) {
  const span = max - min || 1;
  const step = VIEW_WIDTH / (points.length - 1);
  return points
    .map((value, i) => {
      const x = i * step;
      const y = height - ((value - min) / span) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function EquityCurve({ series, xLabels, height = 220 }: EquityCurveProps) {
  const allValues = series.flatMap((s) => s.points);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const gridLines = 4;

  return (
    <div>
      {series.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-4">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="font-mono text-xs uppercase tracking-widest text-strat-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        role="img"
        aria-label={`Line chart: ${series.map((s) => s.label).join(" vs ")}`}
        className="w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {Array.from({ length: gridLines + 1 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            x2={VIEW_WIDTH}
            y1={(height / gridLines) * i}
            y2={(height / gridLines) * i}
            stroke="rgba(26,21,35,0.08)"
            strokeWidth={1}
          />
        ))}

        {series.map((s) => {
          const path = toPath(s.points, min, max, height);
          const lastX = VIEW_WIDTH;
          const lastY =
            height - ((s.points[s.points.length - 1] - min) / (max - min || 1)) * height;
          return (
            <g key={s.label}>
              <path
                d={path}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={lastX} cy={lastY} r={3} fill={s.color} />
            </g>
          );
        })}
      </svg>

      {xLabels && (
        <div className="relative mt-2 h-4 font-mono text-[0.72rem] text-strat-muted">
          {xLabels.map((label, i) =>
            label ? (
              <span
                key={i}
                className="absolute -translate-x-1/2"
                style={{ left: `${(i / (xLabels.length - 1)) * 100}%` }}
              >
                {label}
              </span>
            ) : null,
          )}
        </div>
      )}

      <table className="sr-only">
        <caption>{series.map((s) => s.label).join(" vs ")}</caption>
        <thead>
          <tr>
            <th scope="col">Point</th>
            {series.map((s) => (
              <th scope="col" key={s.label}>
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series[0]?.points.map((_, i) => (
            <tr key={i}>
              <td>{xLabels?.[i] ?? i + 1}</td>
              {series.map((s) => (
                <td key={s.label}>{s.points[i]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
