import type { Metadata } from "next";
import LandlordRequests from "@/components/dashboard/landlord/landlord-requests";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Rental requests",
};

export default function LandlordRequestsPage() {
  return (
    <>
      <PageHeader title="Rental requests" description="Approve or reject new requests and complete finished rentals." />
      <LandlordRequests />
    </>
  );
}
