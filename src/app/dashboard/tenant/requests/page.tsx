import type { Metadata } from "next";
import PageHeader from "@/components/dashboard/page-header";
import TenantRequests from "@/components/dashboard/tenant/tenant-requests";

export const metadata: Metadata = {
  title: "My rental requests",
};

export default function TenantRequestsPage() {
  return (
    <>
      <PageHeader title="My rental requests" description="See the status of every request, pay for approved ones and leave reviews." />
      <TenantRequests />
    </>
  );
}
