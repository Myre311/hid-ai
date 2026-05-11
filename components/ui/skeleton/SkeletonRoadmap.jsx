export default function SkeletonRoadmap() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/10 bg-surface/40 p-5 flex items-center gap-4"
        >
          <div className="animate-pulse bg-white/5 rounded-md w-12 h-12 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="animate-pulse bg-white/5 rounded h-4 w-2/3" />
            <div className="animate-pulse bg-white/5 rounded h-3 w-1/2" />
          </div>
          <div className="animate-pulse bg-white/5 rounded-full w-10 h-10 shrink-0" />
        </div>
      ))}
    </div>
  );
}
