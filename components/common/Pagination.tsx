// components/ui/pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemLabel,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const labelPlural = totalItems !== 1 ? `${itemLabel}s` : itemLabel;

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/60 px-4 py-3 sm:flex-row">
      <p className="order-2 text-xs text-muted-foreground sm:order-1">
        {totalItems} {labelPlural} en total
      </p>

      <div className="order-1 flex items-center gap-1.5 sm:order-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
          className="size-8 bg-background"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <span className="min-w-16 text-center text-xs font-medium tabular-nums text-muted-foreground">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
          className="size-8 bg-background"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
