import type { Metadata } from "next";
import { Suspense } from "react";
import PropertyBrowser from "@/components/property/property-browser";
import PropertyGridSkeleton from "@/components/property/property-grid-skeleton";
import PropertyResults, { type PropertySearchParams } from "@/components/property/property-results";
import Skeleton from "@/components/ui/skeleton";
import { serverFetch } from "@/lib/server-api";
import type { Category } from "@/types";

export const metadata: Metadata = {
  title: "Browse properties",
  description: "Search rental properties by location, price, type and amenities.",
};

const loadCategories = async () => {
  try {
    const result = await serverFetch<Category[]>("/categories");

    return result.data;
  } catch {
    return [];
  }
};

const BrowserSkeleton = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Skeleton className="hidden h-[520px] rounded-xl lg:block" />
      <PropertyGridSkeleton count={6} />
    </div>
  );
};

const PropertiesSection = async ({ searchParams }: { searchParams: Promise<PropertySearchParams> }) => {
  const [params, categories] = await Promise.all([searchParams, loadCategories()]);

  return (
    <PropertyBrowser categories={categories}>
      <Suspense key={JSON.stringify(params)} fallback={<PropertyGridSkeleton count={6} />}>
        <PropertyResults params={params} />
      </Suspense>
    </PropertyBrowser>
  );
};

export default function PropertiesPage({ searchParams }: PageProps<"/properties">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Browse properties</h1>
        <p className="mt-1 text-muted-foreground">Use the filters to find a place that fits your budget and needs.</p>
      </header>
      <Suspense fallback={<BrowserSkeleton />}>
        <PropertiesSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
