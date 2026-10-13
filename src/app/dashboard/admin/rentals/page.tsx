import type { Metadata } from "next";
import AdminRentals from "@/components/dashboard/admin/admin-rentals";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "All rental requests",
};

export default function AdminRentalsPage() {
  return (
    <>
      <PageHeader title="All rental requests" description="Every rental request between tenants and landlords." />
      <AdminRentals />
    </>
  );
}
