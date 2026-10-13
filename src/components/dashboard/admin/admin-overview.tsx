"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Building2, ClipboardList, FolderTree, Hourglass, Users, Wallet, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { AdminStats } from "@/types";

interface QuickLink {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const quickLinks: QuickLink[] = [
  { href: "/dashboard/admin/users", label: "Manage users", description: "Search users and ban or unban accounts", icon: Users },
  { href: "/dashboard/admin/properties", label: "Review listings", description: "Inspect every listing and remove bad ones", icon: Building2 },
  { href: "/dashboard/admin/rentals", label: "Rental requests", description: "Follow all requests across the platform", icon: ClipboardList },
  { href: "/dashboard/admin/categories", label: "Property categories", description: "Add, rename or delete property types", icon: FolderTree },
];

const AdminOverview = () => {
  const { data, isPending } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => (await api.get<AdminStats>("/admin/stats")).data,
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={data?.totalUsers} icon={Users} hint={`${data?.totalTenants ?? 0} tenants, ${data?.totalLandlords ?? 0} landlords, ${data?.bannedUsers ?? 0} banned`} loading={isPending} />
        <StatCard label="Properties" value={data?.totalProperties} icon={Building2} hint={`${data?.availableProperties ?? 0} available, ${data?.rentedProperties ?? 0} rented`} loading={isPending} />
        <StatCard label="Pending requests" value={data?.pendingRequests} icon={Hourglass} hint={`${data?.totalRequests ?? 0} requests in total, ${data?.activeRentals ?? 0} active`} loading={isPending} />
        <StatCard label="Platform revenue" value={data ? formatCurrency(data.totalRevenue) : undefined} icon={Wallet} hint={`${data?.completedPayments ?? 0} completed payments`} loading={isPending} />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Moderation</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <Card className="flex h-full items-center gap-4 p-5 transition group-hover:border-primary group-hover:shadow-md">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <link.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{link.label}</p>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
