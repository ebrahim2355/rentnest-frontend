import type { Metadata } from "next";
import PropertyForm from "@/components/dashboard/landlord/property-form";
import PageHeader from "@/components/dashboard/page-header";

export const metadata: Metadata = {
  title: "Add property",
};

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Add a property" description="Fill in the details so tenants can find your place." />
      <PropertyForm />
    </div>
  );
}
