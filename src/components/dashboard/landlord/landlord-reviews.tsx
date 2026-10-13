"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import ErrorNotice from "@/components/ui/error-notice";
import Pagination from "@/components/ui/pagination";
import RatingStars from "@/components/ui/rating-stars";
import Skeleton from "@/components/ui/skeleton";
import { api, getErrorText } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

const LandlordReviews = () => {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["landlord", "reviews", { page }],
    queryFn: () => api.get<Review[]>("/landlord/reviews", { page, limit: 6 }),
    placeholderData: keepPreviousData,
    meta: { silent: true },
  });

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorNotice title={getErrorText(error).title} description={getErrorText(error).description} onRetry={() => refetch()} />;
  }

  if (!data.data.length) {
    return <EmptyState icon={MessageSquareText} title="No reviews yet" description="Tenants can review your properties after they rent them." />;
  }

  return (
    <div className="space-y-4">
      <ul className="grid gap-4 md:grid-cols-2">
        {data.data.map((review) => (
          <li key={review.id}>
            <Card className="h-full p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{review.tenant?.name ?? "Tenant"}</p>
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
              <RatingStars rating={review.rating} className="mt-1" />
              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                For <span className="font-medium text-foreground">{review.property?.title}</span>
              </p>
            </Card>
          </li>
        ))}
      </ul>
      {data.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPageChange={setPage} />}
    </div>
  );
};

export default LandlordReviews;
