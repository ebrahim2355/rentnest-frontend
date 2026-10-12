import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Skeleton from "@/components/ui/skeleton";
import { serverFetch } from "@/lib/server-api";
import type { Category } from "@/types";

const loadCategories = async () => {
  try {
    const result = await serverFetch<Category[]>("/categories");

    return result.data;
  } catch {
    return [];
  }
};

export const CategoryListSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-28 rounded-xl" />
      ))}
    </div>
  );
};

const CategoryList = async () => {
  const categories = await loadCategories();

  if (!categories.length) {
    return <p className="text-center text-sm text-muted-foreground">Property types will be listed here soon.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/properties?type=${encodeURIComponent(category.name)}`}
          className="group flex flex-col rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-md"
        >
          <span className="font-semibold">{category.name}</span>
          <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">{category.description}</span>
          <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-medium text-primary">
            {category._count?.properties ?? 0} {category._count?.properties === 1 ? "listing" : "listings"}
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
