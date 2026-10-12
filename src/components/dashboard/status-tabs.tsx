"use client";

import { cn, toTitleCase } from "@/lib/utils";

interface StatusTabsProps {
  statuses: readonly string[];
  value: string;
  onChange: (status: string) => void;
}

const StatusTabs = ({ statuses, value, onChange }: StatusTabsProps) => {
  return (
    <div role="tablist" aria-label="Filter by status" className="mb-5 flex flex-wrap gap-2">
      {["", ...statuses].map((status) => (
        <button
          key={status || "all"}
          type="button"
          role="tab"
          aria-selected={value === status}
          onClick={() => onChange(status)}
          className={cn(
            "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
            value === status ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-primary hover:text-primary"
          )}
        >
          {status ? toTitleCase(status) : "All"}
        </button>
      ))}
    </div>
  );
};

export default StatusTabs;
