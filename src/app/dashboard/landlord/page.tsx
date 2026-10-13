import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import LandlordOverview from "@/components/dashboard/landlord/landlord-overview";
import PageHeader from "@/components/dashboard/page-header";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Landlord dashboard",
};

export default function LandlordDashboardPage() {
  return (
    <>
      <PageHeader
        title="Landlord dashboard"
        description="An overview of your properties, requests and earnings."
        action={
          <Link href="/dashboard/landlord/properties/new" className={buttonStyles("primary", "md")}>
            <Plus className="size-4" />
            Add property
          </Link>
        }
      />
      <LandlordOverview />
    </>
  );
}
