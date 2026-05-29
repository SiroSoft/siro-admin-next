"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { Edit, Trash2, Eye } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { DeleteDialog } from "@/components/delete-dialog";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { useOrders, useDeleteOrder } from "@/hooks/use-orders";
import type { components } from "@/types/api";

type Order = components["schemas"]["Order"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

interface OrderTableProps {
  onEdit: (order: Order) => void;
  onCreate: () => void;
  onView?: (order: Order) => void;
  params: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
}

const columnHelper = createColumnHelper<Order>();

export function OrderTable({ onEdit, onCreate, onView, params, onParamsChange }: OrderTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { orders, meta, isLoading, isError, error, refetch } = useOrders(params);
  const deleteMutation = useDeleteOrder();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => <span className="font-mono text-xs">#{info.getValue()}</span>,
      }),
      columnHelper.accessor("user_name", {
        header: "Customer",
        cell: (info) => <span className="font-medium">{info.getValue() ?? "N/A"}</span>,
      }),
      columnHelper.accessor("total", {
        header: "Total",
        cell: (info) => <span className="font-mono">${formatNumber(info.getValue() ?? 0)}</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue() ?? ""} />,
      }),
      columnHelper.accessor("payment_status", {
        header: "Payment",
        cell: (info) => (
          <Badge variant={info.getValue() === "paid" ? "success" : info.getValue() === "failed" ? "destructive" : "secondary"}>
            {info.getValue() ?? "N/A"}
          </Badge>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Date",
        cell: (info) => (
          <span className="text-muted-foreground text-xs">{formatDate(info.getValue() ?? "")}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <div className="flex justify-end gap-1">
            {onView && (
              <Button variant="ghost" size="icon" onClick={() => onView(info.row.original)} aria-label={`View order #${info.row.original.id}`}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => onEdit(info.row.original)} aria-label={`Edit order #${info.row.original.id}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(info.row.original.id!)} aria-label={`Delete order #${info.row.original.id}`}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onView],
  );

  const table = useReactTable({
    data: orders,
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
      {!isLoading && orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Get started by creating your first order."
          action={<Button onClick={onCreate}>Create Order</Button>}
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
