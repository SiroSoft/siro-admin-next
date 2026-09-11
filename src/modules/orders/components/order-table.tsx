"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { useServerSorting } from "@/hooks/use-server-sorting";
import { Edit, Trash2, Eye } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
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
  const { t } = useI18n();
  const { sorting, handleSortingChange } = useServerSorting(onParamsChange);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { orders, meta, isLoading, isError, error, refetch } = useOrders(params);
  const deleteMutation = useDeleteOrder();

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => t("common.id") || "ID",
        cell: (info) => <span className="font-mono text-xs">#{info.getValue()}</span>,
      }),
      columnHelper.accessor("user_name", {
        header: t("orders.customer"),
        cell: (info) => <span className="font-medium">{info.getValue() ?? "N/A"}</span>,
      }),
      columnHelper.accessor("total", {
        header: t("orders.total"),
        cell: (info) => <span className="font-mono">{formatCurrency(info.getValue() ?? 0)}</span>,
      }),
      columnHelper.accessor("status", {
        header: t("common.status"),
        cell: (info) => <StatusBadge status={info.getValue() ?? ""} />,
      }),
      columnHelper.accessor("payment_status", {
        header: () => t("orders.payment") || "Payment",
        cell: (info) => (
          <Badge variant={info.getValue() === "paid" ? "success" : info.getValue() === "failed" ? "destructive" : "secondary"}>
            {info.getValue() ?? "N/A"}
          </Badge>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: t("orders.date"),
        cell: (info) => (
          <span className="text-muted-foreground text-xs">{formatDate(info.getValue() ?? "")}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <div className="flex justify-end gap-1">
            {onView && (
              <Button variant="ghost" size="icon" onClick={() => onView(info.row.original)} aria-label={`${t("a11y.view")} #${info.row.original.id}`}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => onEdit(info.row.original)} aria-label={`${t("a11y.edit")} #${info.row.original.id}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(info.row.original.id!)} aria-label={`${t("a11y.delete")} #${info.row.original.id}`}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onView, t],
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
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
          title={t("common.noData")}
          description={t("orders.title")}
          action={<Button onClick={onCreate}>{t("orders.create")}</Button>}
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
