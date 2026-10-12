import { CalendarDays, Clock, CreditCard, MapPin, Star, XCircle } from "lucide-react";
import Link from "next/link";
import PropertyImage from "@/components/property/property-image";
import { StatusBadge } from "@/components/ui/badge";
import Button, { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RatingStars from "@/components/ui/rating-stars";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { RentalRequest } from "@/types";

interface RentalCardProps {
  rental: RentalRequest;
  onCancel?: (rental: RentalRequest) => void;
  onReview?: (rental: RentalRequest) => void;
}

const statusHints: Partial<Record<RentalRequest["status"], string>> = {
  PENDING: "Waiting for the landlord to respond",
  APPROVED: "Approved. Pay now to confirm your rental",
  REJECTED: "The landlord declined this request",
  CANCELLED: "You cancelled this request",
};

const RentalCard = ({ rental, onCancel, onReview }: RentalCardProps) => {
  const canCancel = rental.status === "PENDING" || rental.status === "APPROVED";
  const canReview = (rental.status === "ACTIVE" || rental.status === "COMPLETED") && !rental.review;

  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:w-28">
        <PropertyImage src={rental.property.images[0]} alt={rental.property.title} sizes="(max-width: 640px) 100vw, 112px" />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/properties/${rental.property.id}`} className="truncate font-semibold transition hover:text-primary">
            {rental.property.title}
          </Link>
          <StatusBadge status={rental.status} />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {rental.property.location}
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            Move in {formatDate(rental.moveInDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {rental.durationMonths} {rental.durationMonths === 1 ? "month" : "months"}
          </span>
        </p>
        {statusHints[rental.status] && <p className="text-xs text-muted-foreground">{statusHints[rental.status]}</p>}
        {rental.review && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            Your review
            <RatingStars rating={rental.review.rating} />
          </p>
        )}
      </div>

      <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
        <p className="text-lg font-bold">{formatCurrency(rental.totalAmount)}</p>
        <div className="flex flex-wrap justify-end gap-2">
          {rental.status === "APPROVED" && (
            <Link href={`/dashboard/tenant/requests/${rental.id}/pay`} className={buttonStyles("primary", "sm")}>
              <CreditCard className="size-4" />
              Pay now
            </Link>
          )}
          {canReview && onReview && (
            <Button size="sm" variant="outline" onClick={() => onReview(rental)}>
              <Star className="size-4" />
              Leave review
            </Button>
          )}
          {canCancel && onCancel && (
            <Button size="sm" variant="ghost" onClick={() => onCancel(rental)}>
              <XCircle className="size-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RentalCard;
