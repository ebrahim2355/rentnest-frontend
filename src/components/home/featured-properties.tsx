import { Building2 } from "lucide-react";
import PropertyCard from "@/components/property/property-card";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import { serverFetch } from "@/lib/server-api";
import type { Property } from "@/types";

const loadFeaturedProperties = async () => {
  try {
    const result = await serverFetch<Property[]>("/properties", { limit: 6 });

    return { properties: result.data, failed: false };
  } catch {
    return { properties: [], failed: true };
  }
};

const FeaturedProperties = async () => {
  const { properties, failed } = await loadFeaturedProperties();

  if (failed) {
    return <ErrorNotice title="Could not load the properties" description="The server did not respond. Please refresh the page in a moment." />;
  }

  if (!properties.length) {
    return <EmptyState icon={Building2} title="No properties yet" description="New listings will show up here as soon as landlords add them." />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, index) => (
        <PropertyCard key={property.id} property={property} preload={index < 3} />
      ))}
    </div>
  );
};

export default FeaturedProperties;
