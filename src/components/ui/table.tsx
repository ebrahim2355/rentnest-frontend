import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Skeleton from "./skeleton";

export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className={cn("w-full min-w-[640px] text-left text-sm", className)} {...props} />
    </div>
  );
};

export const TableHead = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead className={cn("border-b bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase", className)} {...props} />;
};

export const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody className={cn("divide-y", className)} {...props} />;
};

export const TableRow = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => {
  return <tr className={cn("transition hover:bg-muted/40", className)} {...props} />;
};

export const TableHeaderCell = ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => {
  return <th scope="col" className={cn("px-4 py-3 font-semibold", className)} {...props} />;
};

export const TableCell = ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
};

export const TableSkeleton = ({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/60 px-4 py-3">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 px-4 py-4">
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton key={columnIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
