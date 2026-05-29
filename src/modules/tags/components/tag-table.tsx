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
import { formatDate } from "@/lib/utils";
import { DeleteDialog } from "@/components/delete-dialog";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { useTags, useDeleteTag } from "@/hooks/use-tags";
import type { components } from "@/types/api";

type Tag = components["schemas"]["Tag"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

interface TagTableProps {
  onEdit: (tag: Tag) => void;
  onCreate: () => void;
  params: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
}

const columnHelper = createColumnHelper<Tag>();

export function TagTable({ onEdit, onCreate, params, onParamsChange }: TagTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { tags, meta, isLoading, isError, error, refetch } = useTags(params);
  const deleteMutation = useDeleteTag();

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
            <Button variant="ghost" size="icon" onClick={() => onEdit(info.row.original)} aria-label={`Edit ${info.row.original.name ?? "tag"}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(info.row.original.id!)} aria-label={`Delete ${info.row.original.name ?? "tag"}`}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit],
  );

  const table = useReactTable({
    data: tags,
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
      {!isLoading && tags.length === 0 ? (
        <EmptyState
          title="No tags found"
          description="Get started by creating your first tag."
          action={<Button onClick={onCreate}>Create Tag</Button>}
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
