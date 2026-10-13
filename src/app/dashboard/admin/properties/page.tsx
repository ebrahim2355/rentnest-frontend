import type { Metadata } from "next";
import AdminProperties from "@/components/dashboard/admin/admin-properties";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "All listings",
};

export default function AdminPropertiesPage() {
  return (
    <>
      <PageHeader title="All listings" description="Inspect every property on the platform and remove bad listings." />
      <AdminProperties />
    </>
  );
}
