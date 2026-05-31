"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const generatePages = () => {
    const pages: (number | string)[] = [];
    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(totalPages, currentPage + siblingCount);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex flex-col items-center gap-4 pb-8">
      <nav
        aria-label="Pagination"
        className="flex flex-col items-center gap-4 sm:flex-row"
      >
        <Button
          variant="outline"
          size="sm"
          className="order-2 w-full gap-1 sm:order-1 sm:w-auto"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>

        <div className="order-1 flex items-center gap-1 sm:order-2">
          {generatePages().map((page, index) =>
            typeof page === "number" ? (
              <Button
                key={index}
                size="icon"
                variant={currentPage === page ? "default" : "ghost"}
                className="size-8"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-1 text-muted-foreground">
                {page}
              </span>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="order-3 w-full gap-1 sm:w-auto"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      </nav>
    </div>
  );
}
