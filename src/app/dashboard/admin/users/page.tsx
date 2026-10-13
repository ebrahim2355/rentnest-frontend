import type { Metadata } from "next";
import AdminUsers from "@/components/dashboard/admin/admin-users";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Manage users",
};

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Manage users" description="Search every account and ban or unban users." />
      <AdminUsers />
    </>
  );
}
