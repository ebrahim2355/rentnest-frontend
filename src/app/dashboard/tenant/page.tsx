import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/page-header";
import TenantOverview from "@/components/dashboard/tenant/tenant-overview";

export const metadata: Metadata = {
  title: "Tenant dashboard",
};

export default function TenantDashboardPage() {
  return (
    <>
      <PageHeader title="Tenant dashboard" description="Track your rental requests and payments." />
      <TenantOverview />
    </>
  );
}
