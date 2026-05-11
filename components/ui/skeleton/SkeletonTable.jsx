import SkeletonBox from "@/components/ui/skeleton/SkeletonBox";

const COLS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
};

export default function SkeletonTable({ rows = 10, cols = 6 }) {
  const gridClass = COLS_CLASS[cols] ?? "grid-cols-6";

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden bg-surface/40">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={`grid ${gridClass} gap-4 px-4 py-3 border-b border-white/5`}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <SkeletonBox key={colIdx} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}
