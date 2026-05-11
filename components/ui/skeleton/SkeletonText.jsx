const WIDTHS = ["w-full", "w-4/5", "w-11/12", "w-3/4", "w-5/6", "w-full", "w-4/5", "w-11/12"];

export default function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-white/5 rounded h-4 ${WIDTHS[i % WIDTHS.length]}`}
        />
      ))}
    </div>
  );
}
