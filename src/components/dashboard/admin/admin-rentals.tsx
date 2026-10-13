"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { useState } from "react";
import StatusTabs from "@/components/dashboard/status-tabs";
import { StatusBadge } from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import Pagination from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableSkeleton } from "@/components/ui/table";
import { api, getErrorText } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { RentalRequest } from "@/types";

const statuses = ["PENDING", "APPROVED", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"] as const;

const AdminRentals = () => {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["admin", "rentals", { status, page }],
    queryFn: () => api.get<RentalRequest[]>("/admin/rentals", { status, page, limit: 8 }),
    placeholderData: keepPreviousData,
    meta: { silent: true },
  });

  const changeStatus = (next: string) => {
    setStatus(next);
    setPage(1);
  };

  return (
    <>
      <StatusTabs statuses={statuses} value={status} onChange={changeStatus} />

      {isPending && <TableSkeleton rows={6} columns={5} />}

      {isError && <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} />}

      {data && !data.data.length && <EmptyState icon={ClipboardList} title="No rental requests found" description="There is no request with this status." />}

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
                <TableHeaderCell>Requested</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {data.data.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <p className="font-medium">{request.tenant.name}</p>
                    <p className="text-xs text-muted-foreground">{request.tenant.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-60 truncate font-medium">{request.property.title}</p>
                    <p className="text-xs text-muted-foreground">{request.property.location}</p>
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
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(request.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />}
        </div>
      )}
    </>
  );
};

export default AdminRentals;
