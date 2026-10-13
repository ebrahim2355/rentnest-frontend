"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import { useState } from "react";
import StatusTabs from "@/components/dashboard/status-tabs";
import { StatusBadge } from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import Pagination from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableSkeleton } from "@/components/ui/table";
import { api, getErrorText } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";

const statuses = ["COMPLETED", "PENDING", "FAILED"] as const;

const TenantPayments = () => {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["tenant", "payments", { status, page }],
    queryFn: () => api.get<Payment[]>("/payments", { status, page, limit: 8 }),
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

      {isPending && <TableSkeleton rows={5} columns={5} />}

      {isError && <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} />}

      {data && !data.data.length && <EmptyState icon={Receipt} title="No payments found" description="Payments you make for approved rental requests will be listed here." />}

      {data && data.data.length > 0 && (
        <div className="space-y-4">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Property</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Transaction</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {data.data.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <p className="font-medium">{payment.rentalRequest?.property.title ?? "Property"}</p>
                    <p className="text-xs text-muted-foreground">{payment.rentalRequest?.property.location}</p>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(payment.paidAt ?? payment.createdAt)}</TableCell>
                  <TableCell>
                    <span className="block max-w-44 truncate font-mono text-xs text-muted-foreground" title={payment.transactionId}>
                      {payment.transactionId}
                    </span>
                  </TableCell>
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

export default TenantPayments;
