import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentCancelled from "@/components/payment/payment-cancelled";
import Skeleton from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment cancelled",
};

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <Suspense fallback={<Skeleton className="h-80 rounded-xl" />}>
        <PaymentCancelled />
      </Suspense>
    </div>
  );
}
