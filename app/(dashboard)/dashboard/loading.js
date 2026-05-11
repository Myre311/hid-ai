import SkeletonRoadmap from "@/components/ui/skeleton/SkeletonRoadmap";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-10 max-w-5xl px-8 py-12">
      <div className="space-y-3">
        <div className="animate-pulse bg-white/5 rounded h-10 w-1/3" />
        <div className="animate-pulse bg-white/5 rounded h-5 w-2/3" />
      </div>
      <SkeletonRoadmap />
    </div>
  );
}
