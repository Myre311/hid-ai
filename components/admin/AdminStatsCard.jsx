export function AdminStatsCard({ label, value, hint, accent = false }) {
  return (
    <div className="rounded-lg border border-white/10 bg-surface p-5 flex flex-col gap-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
        {label}
      </p>
      <p
        className={`text-3xl md:text-4xl font-medium tabular-nums ${
          accent ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-foreground/55">{hint}</p>}
    </div>
  );
}
