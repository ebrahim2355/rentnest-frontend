import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import { ApiError, buildQuery } from "@/lib/http";
import { serverFetch } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import type { Meta, Property } from "@/types";
import PropertyCard from "./property-card";

export type PropertySearchParams = Record<string, string | string[] | undefined>;

const filterKeys = ["searchTerm", "location", "type", "minPrice", "maxPrice", "bedrooms", "amenities"];

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const buildApiQuery = (params: PropertySearchParams) => {
  const query: Record<string, string | number> = { limit: 9 };

  filterKeys.forEach((key) => {
    const value = first(params[key]);

    if (value) {
      query[key] = value;
    }
  });

  const [sortBy, sortOrder] = (first(params.sort) ?? "").split(":");

  if (sortBy && sortOrder) {
    query.sortBy = sortBy;
    query.sortOrder = sortOrder;
  }

  const page = Number(first(params.page));

  if (Number.isInteger(page) && page > 1) {
    query.page = page;
  }

  return query;
};

const loadProperties = async (params: PropertySearchParams) => {
  try {
    const result = await serverFetch<Property[]>("/properties", buildApiQuery(params));

    return { properties: result.data, meta: result.meta, error: null };
  } catch (error) {
    return { properties: [], meta: undefined, error: error instanceof ApiError ? error : new ApiError("Something went wrong", 500, "Please try again") };
  }
};

const pageHref = (params: PropertySearchParams, page: number) => {
  const query: Record<string, string | number> = {};

  Object.entries(params).forEach(([key, value]) => {
    const single = first(value);

    if (single && key !== "page") {
      query[key] = single;
    }
  });

  if (page > 1) {
    query.page = page;
  }

  return `/properties${buildQuery(query)}`;
};

const ResultsPagination = ({ params, meta }: { params: PropertySearchParams; meta: Meta }) => {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={pageHref(params, meta.page - 1)}
          aria-disabled={meta.page <= 1}
          className={cn(buttonStyles("outline", "sm"), meta.page <= 1 && "pointer-events-none opacity-50")}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>
        <Link
          href={pageHref(params, meta.page + 1)}
          aria-disabled={meta.page >= meta.totalPages}
          className={cn(buttonStyles("outline", "sm"), meta.page >= meta.totalPages && "pointer-events-none opacity-50")}
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </nav>
  );
};

const PropertyResults = async ({ params }: { params: PropertySearchParams }) => {
  const { properties, meta, error } = await loadProperties(params);

  if (error) {
    const description = Array.isArray(error.details) ? error.details.map((detail) => detail.message).join(". ") : error.details;

    return <ErrorNotice title={error.status === 400 ? "These filters are not valid" : "Could not load the properties"} description={description} />;
  }

  if (!properties.length) {
    return (
      <EmptyState
        icon={SearchX}
        title="No properties match your filters"
        description="Try a different location, a wider price range or fewer amenities."
        action={
          <Link href="/properties" className={buttonStyles("outline", "sm")}>
            Clear filters
          </Link>
        }
      />
    );
  }

  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{properties.length}</span> of <span className="font-semibold text-foreground">{meta?.total ?? properties.length}</span> properties
      </p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {properties.map((property, index) => (
          <PropertyCard key={property.id} property={property} preload={index < 3} />
        ))}
      </div>
      {meta && <ResultsPagination params={params} meta={meta} />}
    </>
  );
};

export default PropertyResults;
