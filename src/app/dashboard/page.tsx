"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { DASHBOARD_HOME } from "@/lib/constants";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    router.replace(user ? DASHBOARD_HOME[user.role] : "/auth/login");
  }, [isLoading, user, router]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Opening your dashboard
    </div>
  );
}
