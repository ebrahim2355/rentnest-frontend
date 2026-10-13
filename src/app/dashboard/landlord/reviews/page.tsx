import type { Metadata } from "next";
import LandlordReviews from "@/components/dashboard/landlord/landlord-reviews";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function LandlordReviewsPage() {
  return (
    <>
      <PageHeader title="Tenant reviews" description="What tenants say about your properties." />
      <LandlordReviews />
    </>
  );
}
