import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/page-header";
import TenantPayments from "@/components/dashboard/tenant/tenant-payments";

export const metadata: Metadata = {
  title: "Payment history",
};

export default function TenantPaymentsPage() {
  return (
    <>
      <PageHeader title="Payment history" description="Every payment you have made, with its status." />
      <TenantPayments />
    </>
  );
}
