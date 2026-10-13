"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Clock, CreditCard, Info, Lock, MapPin } from "lucide-react";
import Link from "next/link";
import PropertyImage from "@/components/property/property-image";
import { StatusBadge } from "@/components/ui/badge";
import Button, { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorNotice from "@/components/ui/error-notice";
import Skeleton from "@/components/ui/skeleton";
import { api, getErrorText, showErrorToast } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CheckoutSession, RentalRequest, RentalStatus } from "@/types";

const statusMessages: Partial<Record<RentalStatus, string>> = {
  PENDING: "The landlord has not approved this request yet. You can pay as soon as it is approved.",
  REJECTED: "This request was rejected, so there is nothing to pay.",
  CANCELLED: "This request was cancelled, so there is nothing to pay.",
  ACTIVE: "This rental is already paid and active.",
  COMPLETED: "This rental is already paid and completed.",
};

const PayPanel = ({ rentalRequestId }: { rentalRequestId: string }) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["tenant", "rental", rentalRequestId],
    queryFn: async () => (await api.get<RentalRequest>(`/rentals/${rentalRequestId}`)).data,
    meta: { silent: true },
  });

  const checkout = useMutation({
    mutationFn: () => api.post<CheckoutSession>("/payments/checkout", { rentalRequestId, clientUrl: window.location.origin }),
    onSuccess: (result) => {
      window.location.assign(result.data.checkoutUrl);
    },
    onError: showErrorToast,
  });

  if (isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorNotice
          title={getErrorText(error).title}
          description={getErrorText(error).description}
          action={
            <Link href="/dashboard/tenant/requests" className={buttonStyles("outline", "sm")}>
              Back to my requests
            </Link>
          }
        />
      </div>
    );
  }

  const monthlyRent = Number(data.totalAmount) / data.durationMonths;
  const isRedirecting = checkout.isPending || checkout.isSuccess;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/dashboard/tenant/requests" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary">
        <ArrowLeft className="size-4" />
        Back to my requests
      </Link>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:flex-row">
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:w-32">
            <PropertyImage src={data.property.images[0]} alt={data.property.title} sizes="(max-width: 640px) 100vw, 128px" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">{data.property.title}</h2>
              <StatusBadge status={data.status} />
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {data.property.location}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4 shrink-0" />
              Move in {formatDate(data.moveInDate)}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4 shrink-0" />
              {data.durationMonths} {data.durationMonths === 1 ? "month" : "months"}
            </p>
          </div>
        </div>

        <dl className="space-y-2 border-t p-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Monthly rent</dt>
            <dd className="font-medium">{formatCurrency(monthlyRent)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Duration</dt>
            <dd className="font-medium">x {data.durationMonths}</dd>
          </div>
          <div className="flex justify-between border-t pt-3 text-base">
            <dt className="font-semibold">Total to pay</dt>
            <dd className="font-bold text-primary">{formatCurrency(data.totalAmount)}</dd>
          </div>
        </dl>
      </Card>

      {data.status === "APPROVED" ? (
        <Card className="space-y-4 p-5">
          <Button size="lg" className="w-full" loading={isRedirecting} onClick={() => checkout.mutate()}>
            <CreditCard className="size-4" />
            {isRedirecting ? "Opening Stripe Checkout" : `Pay ${formatCurrency(data.totalAmount)} with Stripe`}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            You will be taken to the secure Stripe payment page.
          </p>
          <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              Test mode: use card number <span className="font-mono font-semibold text-foreground">4242 4242 4242 4242</span>, any future expiry date and any CVC.
            </span>
          </p>
        </Card>
      ) : (
        <Card className="flex items-start gap-3 p-5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <div className="space-y-3">
            <p>{statusMessages[data.status]}</p>
            {(data.status === "ACTIVE" || data.status === "COMPLETED") && (
              <Link href="/dashboard/tenant/payments" className={buttonStyles("outline", "sm")}>
                View payment history
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PayPanel;
