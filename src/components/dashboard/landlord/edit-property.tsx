"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { buttonStyles } from "@/components/ui/button";
import ErrorNotice from "@/components/ui/error-notice";
import Skeleton from "@/components/ui/skeleton";
import { api, getErrorText } from "@/lib/api";
import type { PropertyDetails } from "@/types";
import PropertyForm from "./property-form";

const backLink = (
  <Link href="/dashboard/landlord/properties" className={buttonStyles("outline", "sm")}>
    Back to my properties
  </Link>
);

const EditProperty = ({ propertyId }: { propertyId: string }) => {
  const { user } = useAuth();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["landlord", "property", propertyId],
    queryFn: async () => (await api.get<PropertyDetails>(`/properties/${propertyId}`)).data,
    meta: { silent: true },
  });

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} action={backLink} />;
  }

  if (user && data.landlordId !== user.id) {
    return <ErrorNotice title="This is not your property" description="You can only edit the properties that you listed." action={backLink} />;
  }

  return <PropertyForm property={data} />;
};

export default EditProperty;
