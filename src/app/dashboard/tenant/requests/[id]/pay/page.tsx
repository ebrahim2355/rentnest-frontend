import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/dashboard/page-header";
import PayPanel from "@/components/payment/pay-panel";
import Skeleton from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Pay for your rental",
};

const PayLoader = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <PayPanel rentalRequestId={id} />;
};

export default function PayPage({ params }: PageProps<"/dashboard/tenant/requests/[id]/pay">) {
  return (
    <>
      <PageHeader title="Complete your payment" description="Review the details and pay securely with Stripe." />
      <Suspense fallback={<Skeleton className="mx-auto h-72 max-w-2xl rounded-xl" />}>
        <PayLoader params={params} />
      </Suspense>
    </>
  );
}
