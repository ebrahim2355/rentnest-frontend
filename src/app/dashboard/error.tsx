"use client";

import ErrorFallback from "@/components/ui/error-fallback";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} homeHref="/dashboard" homeLabel="Back to dashboard" />;
}
