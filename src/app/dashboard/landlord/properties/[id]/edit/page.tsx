import type { Metadata } from "next";
import { Suspense } from "react";
import EditProperty from "@/components/dashboard/landlord/edit-property";
import PageHeader from "@/components/dashboard/page-header";
import Skeleton from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Edit property",
};

const EditLoader = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <EditProperty propertyId={id} />;
};

export default function EditPropertyPage({ params }: PageProps<"/dashboard/landlord/properties/[id]/edit">) {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit property" description="Update the details, amenities or photos of your listing." />
      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <EditLoader params={params} />
      </Suspense>
    </div>
  );
}
