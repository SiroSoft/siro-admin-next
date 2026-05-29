"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { components } from "@/types/api";

type PaginationMeta = components["schemas"]["PaginationMeta"];

interface PaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (!meta || meta.last_page <= 1) return null;

  const { page: currentPage, last_page, total } = meta;
  const pages: number[] = [];

  for (let i = Math.max(1, currentPage - 2); i <= Math.min(last_page, currentPage + 2); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        Showing page {currentPage} of {last_page} ({total} total)
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage >= last_page}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
