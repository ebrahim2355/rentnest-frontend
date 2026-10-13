"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import StatusTabs from "@/components/dashboard/status-tabs";
import { Badge, StatusBadge } from "@/components/ui/badge";
import Button, { buttonStyles } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import Pagination from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableSkeleton } from "@/components/ui/table";
import { api, getErrorText, showErrorToast } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types";

const statuses = ["AVAILABLE", "RENTED", "UNAVAILABLE"] as const;

const AdminProperties = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toRemove, setToRemove] = useState<Property | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["admin", "properties", { status, page }],
    queryFn: () => api.get<Property[]>("/admin/properties", { status, page, limit: 8 }),
    placeholderData: keepPreviousData,
    meta: { silent: true },
  });

  const remove = useMutation({
    mutationFn: (property: Property) => api.delete<null>(`/admin/properties/${property.id}`),
    onSuccess: () => {
      toast.success("Listing removed from the platform");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: showErrorToast,
    onSettled: () => setToRemove(null),
  });

  const changeStatus = (next: string) => {
    setStatus(next);
    setPage(1);
  };

  return (
    <>
      <StatusTabs statuses={statuses} value={status} onChange={changeStatus} />

      {isPending && <TableSkeleton rows={6} columns={5} />}

      {isError && <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} onRetry={() => refetch()} />}

      {data && !data.data.length && <EmptyState icon={Building2} title="No listings found" description="There is no property with this status." />}

      {data && data.data.length > 0 && (
        <div className="space-y-4">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Property</TableHeaderCell>
                <TableHeaderCell>Landlord</TableHeaderCell>
                <TableHeaderCell>Rent</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {data.data.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <p className="max-w-64 truncate font-medium">{property.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {property.category?.name} · {property.location}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>{property.landlord?.name}</p>
                    <p className="text-xs text-muted-foreground">{property.landlord?.email}</p>
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">{formatCurrency(property.rent)}</TableCell>
                  <TableCell>{property.isDeleted ? <Badge tone="red">Removed</Badge> : <StatusBadge status={property.status} />}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {property.isDeleted ? (
                        <span className="text-xs text-muted-foreground">No action needed</span>
                      ) : (
                        <>
                          <Link href={`/properties/${property.id}`} className={buttonStyles("ghost", "sm")}>
                            <Eye className="size-4" />
                            View
                          </Link>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => setToRemove(property)}>
                            <Trash2 className="size-4" />
                            Remove
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toRemove)}
        title="Remove this listing?"
        description={`"${toRemove?.title ?? ""}" will be hidden from RentNest and its pending requests will be rejected.`}
        confirmLabel="Remove listing"
        destructive
        loading={remove.isPending}
        onConfirm={() => toRemove && remove.mutate(toRemove)}
        onClose={() => setToRemove(null)}
      />
    </>
  );
};

export default AdminProperties;
