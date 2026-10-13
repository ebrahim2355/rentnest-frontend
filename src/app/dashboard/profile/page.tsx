import type { Metadata } from "next";
import ProfileForm from "@/components/dashboard/profile-form";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "My profile",
};

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="My profile" description="Keep your name and contact number up to date." />
      <ProfileForm />
    </>
  );
}
