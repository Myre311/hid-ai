import SkeletonTable from "@/components/ui/skeleton/SkeletonTable";

export default function EntreprisesLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="animate-pulse bg-white/5 rounded h-8 w-1/4" />
      <SkeletonTable rows={10} cols={5} />
    </div>
  );
}
