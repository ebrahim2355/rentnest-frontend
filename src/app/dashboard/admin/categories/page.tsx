import type { Metadata } from "next";
import AdminCategories from "@/components/dashboard/admin/admin-categories";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Property categories",
};

export default function AdminCategoriesPage() {
  return (
    <>
      <PageHeader title="Property categories" description="The property types landlords choose from and tenants filter by." />
      <AdminCategories />
    </>
  );
}
