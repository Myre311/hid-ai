import SkeletonText from "@/components/ui/skeleton/SkeletonText";

export default function SkeletonCard() {
  return (
    <div className="rounded-lg border border-white/10 bg-surface/60 p-6 space-y-4">
      <div className="animate-pulse bg-white/5 rounded h-6 w-3/4" />
      <SkeletonText lines={3} />
    </div>
  );
}
