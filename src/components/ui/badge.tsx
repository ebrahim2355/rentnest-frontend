import type { ReactNode } from "react";
import { cn, toTitleCase } from "@/lib/utils";

type BadgeTone = "amber" | "blue" | "red" | "green" | "gray" | "teal";

const toneStyles: Record<BadgeTone, string> = {
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300",
  red: "bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300",
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
  gray: "bg-slate-200 text-slate-700 dark:bg-slate-400/15 dark:text-slate-300",
  teal: "bg-primary-soft text-primary dark:text-primary",
};

const statusTones: Record<string, BadgeTone> = {
  PENDING: "amber",
  APPROVED: "blue",
  REJECTED: "red",
  ACTIVE: "green",
  COMPLETED: "gray",
  CANCELLED: "gray",
  FAILED: "red",
  AVAILABLE: "green",
  RENTED: "blue",
  UNAVAILABLE: "gray",
  BANNED: "red",
  TENANT: "teal",
  LANDLORD: "blue",
  ADMIN: "amber",
};

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export const Badge = ({ tone = "gray", className, children }: BadgeProps) => {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", toneStyles[tone], className)}>{children}</span>;
};

export const StatusBadge = ({ status, className }: { status: string; className?: string }) => {
  return (
    <Badge tone={statusTones[status] ?? "gray"} className={className}>
      {toTitleCase(status)}
    </Badge>
  );
};
