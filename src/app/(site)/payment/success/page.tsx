import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentResult from "@/components/payment/payment-result";
import Skeleton from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <PaymentResult />
      </Suspense>
    </div>
  );
}
