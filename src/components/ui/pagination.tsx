"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, total, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
        {total !== undefined && ` (${total} total)`}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;
