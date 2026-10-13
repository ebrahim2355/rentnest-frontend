import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import LandlordProperties from "@/components/dashboard/landlord/landlord-properties";
import PageHeader from "@/components/dashboard/page-header";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My properties",
};

export default function LandlordPropertiesPage() {
  return (
    <>
      <PageHeader
        title="My properties"
        description="Edit your listings, change their availability or remove them."
        action={
          <Link href="/dashboard/landlord/properties/new" className={buttonStyles("primary", "md")}>
            <Plus className="size-4" />
            Add property
          </Link>
        }
      />
      <LandlordProperties />
    </>
  );
}
