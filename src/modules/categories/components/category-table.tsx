"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { DeleteDialog } from "@/components/delete-dialog";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import type { components } from "@/types/api";

type Category = components["schemas"]["Category"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

interface CategoryTableProps {
  onEdit: (category: Category) => void;
  onCreate: () => void;
  params: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
}

const columnHelper = createColumnHelper<Category>();

export function CategoryTable({ onEdit, onCreate, params, onParamsChange }: CategoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { categories, meta, isLoading, isError, error, refetch } = useCategories(params);
  const deleteMutation = useDeleteCategory();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="font-medium flex items-center gap-2">
            {info.row.original.color && (
              <span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: info.row.original.color }} />
            )}
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("slug", {
        header: "Slug",
        cell: (info) => <span className="font-mono text-xs text-muted-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("is_active", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue() ? "active" : "inactive"} />,
      }),
      columnHelper.accessor("sort_order", {
        header: "Order",
        cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: (info) => (
          <span className="text-muted-foreground text-xs">{formatDate(info.getValue() ?? "")}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(info.row.original)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(info.row.original.id!)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit],
  );

  const table = useReactTable({
    data: categories,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  if (isError) {
    return <ErrorState message={(error as Error)?.message} onRetry={() => refetch()} />;
  }

  return (
    <>
      {!isLoading && categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Get started by creating your first category."
          action={<Button onClick={onCreate}>Create Category</Button>}
        />
      ) : (
        <>
          <DataTable table={table} isLoading={isLoading} />
          <Pagination
            meta={meta as PaginationMeta}
            onPageChange={(page) => onParamsChange({ ...params, page })}
          />
        </>
      )}
      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, { onSettled: () => setDeleteId(null) });
          }
        }}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
