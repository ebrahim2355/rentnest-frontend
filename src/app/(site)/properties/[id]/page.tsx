import { Bath, BedDouble, Check, Mail, MapPin, MessageSquare, Phone, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PropertyGallery from "@/components/property/property-gallery";
import RentRequestCard from "@/components/property/rent-request-card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ErrorNotice from "@/components/ui/error-notice";
import RatingStars from "@/components/ui/rating-stars";
import Skeleton from "@/components/ui/skeleton";
import { ApiError } from "@/lib/http";
import { serverFetch } from "@/lib/server-api";
import { formatDate, getInitials } from "@/lib/utils";
import type { PropertyDetails } from "@/types";

export const metadata: Metadata = {
  title: "Property details",
};

const loadProperty = async (id: string) => {
  try {
    const result = await serverFetch<PropertyDetails>(`/properties/${id}`);

    return { property: result.data, status: 200 };
  } catch (error) {
    return { property: null, status: error instanceof ApiError ? error.status : 500 };
  }
};

const DetailsSkeleton = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]" aria-busy="true" aria-label="Loading property">
      <div className="space-y-6">
        <Skeleton className="aspect-video rounded-2xl" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
};

const PropertyDetailsView = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { property, status } = await loadProperty(id);

  if (status === 404 || status === 400) {
    notFound();
  }

  if (!property) {
    return <ErrorNotice title="Could not load this property" description="The server did not respond. Please refresh the page in a moment." />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0 space-y-8">
        <PropertyGallery images={property.images} title={property.title} />

        <header>
          <div className="flex flex-wrap items-center gap-2">
            {property.category && <Badge tone="teal">{property.category.name}</Badge>}
            <StatusBadge status={property.status} />
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {property.address.toLowerCase().includes(property.location.toLowerCase()) ? property.address : `${property.address}, ${property.location}`}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
              <BedDouble className="size-4 text-primary" />
              {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"}
            </span>
            <span className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
              <Bath className="size-4 text-primary" />
              {property.bathrooms} {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
            </span>
            {property.averageRating !== null && (
              <span className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
                <RatingStars rating={property.averageRating} />
                {property.averageRating} ({property.totalReviews})
              </span>
            )}
          </div>
        </header>

        <section>
          <h2 className="text-xl font-semibold">About this place</h2>
          <p className="mt-2 leading-relaxed whitespace-pre-line text-muted-foreground">{property.description}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Amenities</h2>
          {property.amenities.length ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {property.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2 text-sm capitalize">
                  <Check className="size-4 text-primary" />
                  {amenity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="size-4" />
              The landlord has not listed any amenities.
            </p>
          )}
        </section>

        {property.landlord && (
          <section>
            <h2 className="text-xl font-semibold">Landlord</h2>
            <Card className="mt-3 flex flex-wrap items-center gap-4 p-5">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{getInitials(property.landlord.name)}</span>
              <div className="min-w-0">
                <p className="font-semibold">{property.landlord.name}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  {property.landlord.email}
                </p>
                {property.landlord.phone && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="size-4" />
                    {property.landlord.phone}
                  </p>
                )}
              </div>
            </Card>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold">Reviews ({property.totalReviews})</h2>
          {property.reviews.length ? (
            <ul className="mt-3 space-y-3">
              {property.reviews.map((review) => (
                <li key={review.id}>
                  <Card className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{review.tenant?.name ?? "Tenant"}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    <RatingStars rating={review.rating} className="mt-1" />
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="size-4" />
              No reviews yet. Tenants can review this place after renting it.
            </p>
          )}
        </section>
      </div>

      <aside>
        <RentRequestCard property={{ id: property.id, rent: property.rent, status: property.status }} />
      </aside>
    </div>
  );
};

export default function PropertyDetailsPage({ params }: PageProps<"/properties/[id]">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link href="/properties" className="transition hover:text-primary">
          Properties
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Details</span>
      </nav>
      <Suspense fallback={<DetailsSkeleton />}>
        <PropertyDetailsView params={params} />
      </Suspense>
    </div>
  );
}
