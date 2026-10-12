import { Bath, BedDouble, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types";
import PropertyImage from "./property-image";

const PropertyCard = ({ property, preload = false }: { property: Property; preload?: boolean }) => {
  const extraAmenities = property.amenities.length - 3;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <PropertyImage
          src={property.images[0]}
          alt={property.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          preload={preload}
          className="transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {property.category && <Badge tone="teal">{property.category.name}</Badge>}
          {property.status !== "AVAILABLE" && <StatusBadge status={property.status} />}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold transition group-hover:text-primary">{property.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </p>

        <div className="flex flex-wrap gap-1.5">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
              {amenity}
            </span>
          ))}
          {extraAmenities > 0 && <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">+{extraAmenities}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <p>
            <span className="text-lg font-bold text-primary">{formatCurrency(property.rent)}</span>
            <span className="text-sm text-muted-foreground"> / month</span>
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1" title="Bedrooms">
              <BedDouble className="size-4" />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-1" title="Bathrooms">
              <Bath className="size-4" />
              {property.bathrooms}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
