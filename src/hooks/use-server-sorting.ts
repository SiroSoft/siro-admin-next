"use client";

import { useState } from "react";
import type { SortingState } from "@tanstack/react-table";

/**
 * Server-side sorting bridge for DataTables.
 *
 * Tables render with `manualSorting: true`; this hook keeps the sorting
 * state and forwards `{ sort, order }` to the parent via `onParamsChange`
 * (event-driven, so no render-loop risk). Parents merge them into the
 * list query params — same contract as the Nuxt admin.
 */
export function useServerSorting(
  onParamsChange?: (params: Record<string, unknown>) => void,
): {
  sorting: SortingState;
  handleSortingChange: (updater: SortingState | ((prev: SortingState) => SortingState)) => void;
} {
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSortingChange = (
    updater: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    setSorting(next);
    const first = next[0];
    onParamsChange?.({
      sort: first?.id,
      order: first ? (first.desc ? "desc" : "asc") : undefined,
    });
  };

  return { sorting, handleSortingChange };
}
