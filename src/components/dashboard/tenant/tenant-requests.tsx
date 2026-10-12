"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ReviewDialog from "@/components/dashboard/review-dialog";
import StatusTabs from "@/components/dashboard/status-tabs";
import { buttonStyles } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import Pagination from "@/components/ui/pagination";
import Skeleton from "@/components/ui/skeleton";
import { api, getErrorText, showErrorToast } from "@/lib/api";
import type { RentalRequest } from "@/types";
import RentalCard from "./rental-card";

const statuses = ["PENDING", "APPROVED", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"] as const;

const TenantRequests = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toCancel, setToCancel] = useState<RentalRequest | null>(null);
  const [toReview, setToReview] = useState<RentalRequest | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["tenant", "rentals", { status, page }],
    queryFn: () => api.get<RentalRequest[]>("/rentals", { status, page, limit: 6 }),
    placeholderData: keepPreviousData,
    meta: { silent: true },
  });

  const cancelMutation = useMutation({
    mutationFn: (rental: RentalRequest) => api.patch<RentalRequest>(`/rentals/${rental.id}/cancel`),
    onSuccess: () => {
      toast.success("Rental request cancelled");
      setToCancel(null);
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
    onError: (mutationError) => {
      setToCancel(null);
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
            <Skeleton key={index} className="h-36 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorNotice
          title={getErrorText(error).title}
          description={getErrorText(error).description}
          action={
            <button type="button" onClick={() => refetch()} className={buttonStyles("outline", "sm")}>
              Try again
            </button>
          }
        />
      )}

      {data && !data.data.length && (
        <EmptyState
          icon={ClipboardList}
          title={status ? "No requests with this status" : "You have not sent any request yet"}
          description="Find a property you like and send a rental request to the landlord."
          action={
            <Link href="/properties" className={buttonStyles("primary", "sm")}>
              Browse properties
            </Link>
          }
        />
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-4">
          {data.data.map((rental) => (
            <RentalCard key={rental.id} rental={rental} onCancel={setToCancel} onReview={setToReview} />
          ))}
          {data.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toCancel)}
        title="Cancel this request?"
        description={`Your request for "${toCancel?.property.title ?? ""}" will be cancelled. You can send a new one later.`}
        confirmLabel="Yes, cancel it"
        destructive
        loading={cancelMutation.isPending}
        onConfirm={() => toCancel && cancelMutation.mutate(toCancel)}
        onClose={() => setToCancel(null)}
      />

      <ReviewDialog rental={toReview} onClose={() => setToReview(null)} />
    </>
  );
};

export default TenantRequests;
