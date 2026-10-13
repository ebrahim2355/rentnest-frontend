"use client";

import { CircleX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PaymentCancelled = () => {
  const searchParams = useSearchParams();
  const rentalRequestId = searchParams.get("rentalRequestId");
  const canRetry = rentalRequestId !== null && uuidPattern.test(rentalRequestId);

  return (
    <Card className="flex flex-col items-center gap-4 p-10 text-center">
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
        <CircleX className="size-9" />
      </span>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment cancelled</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">You left the payment page, so nothing was charged. Your rental request is still approved and you can pay whenever you are ready.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {canRetry && (
          <Link href={`/dashboard/tenant/requests/${rentalRequestId}/pay`} className={buttonStyles("primary", "md")}>
            Try the payment again
          </Link>
        )}
        <Link href="/dashboard/tenant/requests" className={buttonStyles("outline", "md")}>
          Back to my requests
        </Link>
      </div>
    </Card>
  );
};

export default PaymentCancelled;
