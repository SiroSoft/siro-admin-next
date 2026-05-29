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
import { usePosts, useDeletePost } from "@/hooks/use-posts";
import type { components } from "@/types/api";

type Post = components["schemas"]["Post"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

interface PostTableProps {
  onEdit: (post: Post) => void;
  onCreate: () => void;
  params: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
}

const columnHelper = createColumnHelper<Post>();

export function PostTable({ onEdit, onCreate, params, onParamsChange }: PostTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { posts, meta, isLoading, isError, error, refetch } = usePosts(params);
  const deleteMutation = useDeletePost();

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => (
          <div className="font-medium max-w-[250px] truncate">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("author_name", {
        header: "Author",
        cell: (info) => <span className="text-muted-foreground">{info.getValue() ?? "N/A"}</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue() ?? ""} />,
      }),
      columnHelper.accessor("featured", {
        header: "Featured",
        cell: (info) => (
          <Badge variant={info.getValue() ? "default" : "secondary"}>
            {info.getValue() ? "Yes" : "No"}
          </Badge>
        ),
      }),
      columnHelper.accessor("category_name", {
        header: "Category",
        cell: (info) => <span className="text-xs text-muted-foreground">{info.getValue() ?? "—"}</span>,
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
    data: posts,
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
      {!isLoading && posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Get started by creating your first post."
          action={<Button onClick={onCreate}>Create Post</Button>}
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
