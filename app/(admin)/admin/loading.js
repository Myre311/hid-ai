import SkeletonTable from "@/components/ui/skeleton/SkeletonTable";

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-white/10 bg-surface/40 p-5 h-32"
          />
        ))}
      </div>
      <SkeletonTable rows={10} cols={5} />
    </div>
  );
}
