"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, Hourglass, KeyRound, Star, Wallet } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/ui/stat-card";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { LandlordStats } from "@/types";
import LandlordRequests from "./landlord-requests";

const LandlordOverview = () => {
  const { data, isPending } = useQuery({
    queryKey: ["landlord", "stats"],
    queryFn: async () => (await api.get<LandlordStats>("/landlord/stats")).data,
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total properties" value={data?.totalProperties} icon={Building2} hint={`${data?.availableProperties ?? 0} available, ${data?.rentedProperties ?? 0} rented`} loading={isPending} />
        <StatCard label="Pending requests" value={data?.pendingRequests} icon={Hourglass} hint={`${data?.approvedRequests ?? 0} approved and waiting for payment`} loading={isPending} />
        <StatCard label="Active rentals" value={data?.activeRentals} icon={KeyRound} hint={`${data?.completedRentals ?? 0} completed`} loading={isPending} />
        <StatCard label="Total earnings" value={data ? formatCurrency(data.totalEarnings) : undefined} icon={Wallet} loading={isPending} />
      </div>

      {data && data.totalReviews > 0 && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          Your properties have an average rating of <span className="font-semibold text-foreground">{data.averageRating}</span> from {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}.
        </p>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Latest rental requests</h2>
          <Link href="/dashboard/landlord/requests" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <LandlordRequests limit={5} showTabs={false} />
      </section>
    </div>
  );
};

export default LandlordOverview;
