import type { Metadata } from "next";
import AdminOverview from "@/components/dashboard/admin/admin-overview";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Admin dashboard" description="The health of the whole platform at a glance." />
      <AdminOverview />
    </>
  );
}
