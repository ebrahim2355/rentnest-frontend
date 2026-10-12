"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardList, Hourglass, KeyRound, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReviewDialog from "@/components/dashboard/review-dialog";
import { buttonStyles } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Skeleton from "@/components/ui/skeleton";
import StatCard from "@/components/ui/stat-card";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { RentalRequest, TenantStats } from "@/types";
import RentalCard from "./rental-card";

const TenantOverview = () => {
  const [toReview, setToReview] = useState<RentalRequest | null>(null);

  const stats = useQuery({
    queryKey: ["tenant", "stats"],
    queryFn: async () => (await api.get<TenantStats>("/rentals/stats")).data,
  });

  const recent = useQuery({
    queryKey: ["tenant", "rentals", { status: "", page: 1, limit: 3 }],
    queryFn: () => api.get<RentalRequest[]>("/rentals", { limit: 3 }),
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total requests" value={stats.data?.totalRequests} icon={ClipboardList} loading={stats.isPending} />
        <StatCard label="Waiting for approval" value={stats.data?.pendingRequests} icon={Hourglass} loading={stats.isPending} />
        <StatCard label="Active rentals" value={stats.data?.activeRentals} icon={KeyRound} loading={stats.isPending} />
        <StatCard label="Total paid" value={stats.data ? formatCurrency(stats.data.totalPaid) : undefined} icon={Wallet} hint={`${stats.data?.completedPayments ?? 0} completed payments`} loading={stats.isPending} />
      </div>

      {Boolean(stats.data?.approvedRequests) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-300 bg-blue-50 p-4 text-blue-900 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-200">
          <p className="text-sm font-medium">
            {stats.data?.approvedRequests} approved {stats.data?.approvedRequests === 1 ? "request is" : "requests are"} waiting for your payment.
          </p>
          <Link href="/dashboard/tenant/requests" className={buttonStyles("primary", "sm")}>
            Review and pay
          </Link>
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent requests</h2>
          <Link href="/dashboard/tenant/requests" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {recent.isPending && (
          <div className="space-y-4">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
        )}

        {recent.data && !recent.data.data.length && (
          <EmptyState
            icon={ClipboardList}
            title="No rental requests yet"
            description="When you send a request to a landlord, it will show up here."
            action={
              <Link href="/properties" className={buttonStyles("primary", "sm")}>
                Browse properties
              </Link>
            }
          />
        )}

        {recent.data && recent.data.data.length > 0 && (
          <div className="space-y-4">
            {recent.data.data.map((rental) => (
              <RentalCard key={rental.id} rental={rental} onReview={setToReview} />
            ))}
          </div>
        )}
      </section>

      <ReviewDialog rental={toReview} onClose={() => setToReview(null)} />
    </div>
  );
};

export default TenantOverview;
