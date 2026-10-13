"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Eye, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import StatusTabs from "@/components/dashboard/status-tabs";
import PropertyImage from "@/components/property/property-image";
import { StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import Pagination from "@/components/ui/pagination";
import Skeleton from "@/components/ui/skeleton";
import { api, getErrorText, showErrorToast } from "@/lib/api";
import { cn, formatCurrency } from "@/lib/utils";
import type { ApiResponse, Property, PropertyStatus } from "@/types";

const statuses = ["AVAILABLE", "RENTED", "UNAVAILABLE"] as const;

const LandlordProperties = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Property | null>(null);
  const queryKey = ["landlord", "properties", { status, page }];

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => api.get<Property[]>("/landlord/properties", { status, page, limit: 6 }),
    placeholderData: keepPreviousData,
    meta: { silent: true },
  });

  const availability = useMutation({
    mutationFn: ({ id, next }: { id: string; next: PropertyStatus }) => api.put<Property>(`/landlord/properties/${id}`, { status: next }),
    onMutate: async ({ id, next }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<ApiResponse<Property[]>>(queryKey);

      queryClient.setQueryData<ApiResponse<Property[]>>(queryKey, (current) =>
        current ? { ...current, data: current.data.map((property) => (property.id === id ? { ...property, status: next } : property)) } : current
      );

      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.data.status === "AVAILABLE" ? "Property is now available" : "Property is hidden from tenants");
    },
    onError: (mutationError, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }

      showErrorToast(mutationError);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord"] });
    },
  });

  const remove = useMutation({
    mutationFn: (property: Property) => api.delete<null>(`/landlord/properties/${property.id}`),
    onSuccess: () => {
      toast.success("Property removed");
      setToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["landlord"] });
    },
    onError: (mutationError) => {
      setToDelete(null);
      showErrorToast(mutationError);
    },
  });

  const changeStatus = (next: string) => {
    setStatus(next);
    setPage(1);
  };

  return (
    <>
      <StatusTabs statuses={statuses} value={status} onChange={changeStatus} />

      {isPending && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      )}

      {isError && <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} onRetry={() => refetch()} />}

      {data && !data.data.length && (
        <EmptyState
          icon={Building2}
          title={status ? "No properties with this status" : "You have not listed a property yet"}
          description="Add your first property so tenants can find it and send rental requests."
          action={
            <Link href="/dashboard/landlord/properties/new" className={buttonStyles("primary", "sm")}>
              <Plus className="size-4" />
              Add property
            </Link>
          }
        />
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-4">
          {data.data.map((property) => {
            const isRented = property.status === "RENTED";
            const isAvailable = property.status === "AVAILABLE";

            return (
              <Card key={property.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:w-28">
                  <PropertyImage src={property.images[0]} alt={property.title} sizes="(max-width: 640px) 100vw, 112px" />
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold">{property.title}</h2>
                    <StatusBadge status={property.status} />
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    {property.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {property.category?.name} · {property.bedrooms} bed · {property.bathrooms} bath
                  </p>
                  <p className="font-bold text-primary">
                    {formatCurrency(property.rent)} <span className="text-sm font-normal text-muted-foreground">/ month</span>
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:items-end">
                  <label className={cn("flex items-center gap-2 text-sm", isRented ? "cursor-not-allowed opacity-60" : "cursor-pointer")} title={isRented ? "A rented property cannot be changed" : undefined}>
                    <span className="text-muted-foreground">Available</span>
                    <input
                      type="checkbox"
                      role="switch"
                      className="peer sr-only"
                      checked={isAvailable}
                      disabled={isRented || availability.isPending}
                      onChange={() => availability.mutate({ id: property.id, next: isAvailable ? "UNAVAILABLE" : "AVAILABLE" })}
                    />
                    <span className="relative h-6 w-11 rounded-full bg-input transition peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/properties/${property.id}`} className={buttonStyles("ghost", "sm")}>
                      <Eye className="size-4" />
                      View
                    </Link>
                    <Link href={`/dashboard/landlord/properties/${property.id}/edit`} className={buttonStyles("outline", "sm")}>
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                    <button type="button" onClick={() => setToDelete(property)} className={buttonStyles("ghost", "sm", "text-destructive")}>
                      <Trash2 className="size-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
          {data.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Remove this property?"
        description={`"${toDelete?.title ?? ""}" will be removed from RentNest. Pending requests for it will be rejected.`}
        confirmLabel="Remove property"
        destructive
        loading={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};

export default LandlordProperties;
