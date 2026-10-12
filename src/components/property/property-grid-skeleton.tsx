import Skeleton from "@/components/ui/skeleton";

const PropertyGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading properties">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border bg-card">
          <Skeleton className="aspect-4/3 rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-14" />
            </div>
            <div className="flex justify-between border-t pt-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyGridSkeleton;
