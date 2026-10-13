import PropertyGridSkeleton from "@/components/property/property-grid-skeleton";
import Skeleton from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Skeleton className="mb-3 h-9 w-64" />
      <Skeleton className="mb-8 h-5 w-96 max-w-full" />
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="hidden h-[520px] rounded-xl lg:block" />
        <PropertyGridSkeleton count={6} />
      </div>
    </div>
  );
}
