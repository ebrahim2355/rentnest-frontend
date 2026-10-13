"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CircleCheckBig, Inbox, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StatusTabs from "@/components/dashboard/status-tabs";
import { StatusBadge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import Pagination from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableSkeleton } from "@/components/ui/table";
import { api, getErrorText, showErrorToast } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ApiResponse, RentalRequest, RentalStatus } from "@/types";

const statuses = ["PENDING", "APPROVED", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"] as const;

type Decision = Extract<RentalStatus, "APPROVED" | "REJECTED" | "COMPLETED">;

const successMessages: Record<Decision, string> = {
  APPROVED: "Request approved",
  REJECTED: "Request rejected",
  COMPLETED: "Rental marked as completed",
};

const LandlordRequests = ({ limit = 8, showTabs = true }: { limit?: number; showTabs?: boolean }) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const queryKey = ["landlord", "requests", { status, page, limit }];

  const { data, isPending, isError, error } = useQuery({
    queryKey,
    queryFn: () => api.get<RentalRequest[]>("/landlord/requests", { status, page, limit }),
    placeholderData: keepPreviousData,
    meta: { silent: true },
  });

  const decide = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: Decision }) => api.patch<RentalRequest>(`/landlord/requests/${id}`, { status: decision }),
    onMutate: async ({ id, decision }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<ApiResponse<RentalRequest[]>>(queryKey);

      queryClient.setQueryData<ApiResponse<RentalRequest[]>>(queryKey, (current) =>
        current ? { ...current, data: current.data.map((request) => (request.id === id ? { ...request, status: decision } : request)) } : current
      );

      return { previous };
    },
    onSuccess: (result, { decision }) => {
      toast.success(successMessages[decision], {
        description: decision === "APPROVED" ? `${result.data.tenant.name} can now pay for the rental.` : undefined,
      });
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

  const changeStatus = (next: string) => {
    setStatus(next);
    setPage(1);
  };

  return (
    <>
      {showTabs && <StatusTabs statuses={statuses} value={status} onChange={changeStatus} />}

      {isPending && <TableSkeleton rows={4} columns={6} />}

      {isError && <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} />}

      {data && !data.data.length && (
        <EmptyState icon={Inbox} title={status ? "No requests with this status" : "No rental requests yet"} description="When a tenant asks to rent one of your properties, the request appears here." />
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-4">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Tenant</TableHeaderCell>
                <TableHeaderCell>Property</TableHeaderCell>
                <TableHeaderCell>Move in</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {data.data.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <p className="font-medium">{request.tenant.name}</p>
                    <p className="text-xs text-muted-foreground">{request.tenant.email}</p>
                    {request.tenant.phone && <p className="text-xs text-muted-foreground">{request.tenant.phone}</p>}
                  </TableCell>
                  <TableCell>
                    <p className="max-w-56 truncate font-medium">{request.property.title}</p>
                    {request.message && (
                      <p className="max-w-56 truncate text-xs text-muted-foreground" title={request.message}>
                        &ldquo;{request.message}&rdquo;
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <p>{formatDate(request.moveInDate)}</p>
                    <p className="text-xs text-muted-foreground">
                      {request.durationMonths} {request.durationMonths === 1 ? "month" : "months"}
                    </p>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(request.totalAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {request.status === "PENDING" && (
                        <>
                          <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate({ id: request.id, decision: "APPROVED" })}>
                            <Check className="size-4" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => decide.mutate({ id: request.id, decision: "REJECTED" })}>
                            <X className="size-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === "ACTIVE" && (
                        <Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => decide.mutate({ id: request.id, decision: "COMPLETED" })}>
                          <CircleCheckBig className="size-4" />
                          Mark completed
                        </Button>
                      )}
                      {request.status !== "PENDING" && request.status !== "ACTIVE" && <span className="text-xs text-muted-foreground">No action needed</span>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {showTabs && data.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />}
        </div>
      )}
    </>
  );
};

export default LandlordRequests;
