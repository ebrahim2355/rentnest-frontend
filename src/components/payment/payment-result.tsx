"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Button, { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorNotice from "@/components/ui/error-notice";
import { api, getErrorText } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";

const PaymentResult = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const sessionId = searchParams.get("session_id");

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["payment-confirmation", sessionId],
    queryFn: async () => (await api.post<Payment>("/payments/confirm", { transactionId: sessionId })).data,
    enabled: Boolean(sessionId),
    retry: false,
    staleTime: Infinity,
    meta: { silent: true },
  });

  useEffect(() => {
    if (data) {
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    }
  }, [data, queryClient]);

  if (!sessionId) {
    return (
      <ErrorNotice
        title="No payment to confirm"
        description="This page is opened after paying on Stripe. Start the payment from your rental requests."
        action={
          <Link href="/dashboard/tenant/requests" className={buttonStyles("outline", "sm")}>
            Go to my requests
          </Link>
        }
      />
    );
  }

  if (isPending) {
    return (
      <Card className="flex flex-col items-center gap-4 p-10 text-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <div>
          <h1 className="text-xl font-semibold">Confirming your payment</h1>
          <p className="mt-1 text-sm text-muted-foreground">Please wait a moment and do not close this page.</p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorNotice
        title={getErrorText(error).title}
        description={getErrorText(error).description ?? "We could not confirm the payment yet."}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="sm" loading={isFetching} onClick={() => refetch()}>
              Check again
            </Button>
            <Link href="/dashboard/tenant/requests" className={buttonStyles("outline", "sm")}>
              Go to my requests
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col items-center gap-3 bg-primary-soft px-6 py-10 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CircleCheck className="size-9" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Payment successful</h1>
        <p className="max-w-sm text-sm text-muted-foreground">Your rental is now active. The landlord has been informed and you can move in on the agreed date.</p>
      </div>

      <dl className="space-y-3 p-6 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Property</dt>
          <dd className="text-right font-medium">{data.rentalRequest?.property.title}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Amount paid</dt>
          <dd className="font-bold text-primary">{formatCurrency(data.amount)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Paid on</dt>
          <dd className="font-medium">{data.paidAt ? formatDate(data.paidAt) : "Just now"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Payment method</dt>
          <dd className="font-medium capitalize">
            {data.method} via {data.provider.toLowerCase()}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-muted-foreground">Transaction</dt>
          <dd className="truncate font-mono text-xs">{data.transactionId}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3 border-t p-6">
        <Link href="/dashboard/tenant/requests" className={buttonStyles("primary", "md", "flex-1")}>
          View my rentals
        </Link>
        <Link href="/dashboard/tenant/payments" className={buttonStyles("outline", "md", "flex-1")}>
          Payment history
        </Link>
      </div>
    </Card>
  );
};

export default PaymentResult;
