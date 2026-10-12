import type { LucideIcon } from "lucide-react";
import { Card } from "./card";
import Skeleton from "./skeleton";

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  icon: LucideIcon;
  hint?: string;
  loading?: boolean;
}

const StatCard = ({ label, value, icon: Icon, hint, loading = false }: StatCardProps) => {
  return (
    <Card className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? <Skeleton className="mt-2 h-8 w-20" /> : <p className="mt-1 truncate text-2xl font-bold">{value ?? 0}</p>}
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-5" />
      </span>
    </Card>
  );
};

export default StatCard;
