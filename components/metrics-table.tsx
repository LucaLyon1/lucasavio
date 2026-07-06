type Metric = { label: string; value: string };

export default function MetricsTable({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-black/[0.07] sm:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-strat-bg px-5 py-4">
          <div className="font-mono text-xl text-strat-text">{metric.value}</div>
          <div className="mt-1 font-mono text-[0.72rem] uppercase tracking-widest text-strat-muted">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
