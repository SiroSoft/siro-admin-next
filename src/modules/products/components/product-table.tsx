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
import { formatDate, formatNumber } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { DeleteDialog } from "@/components/delete-dialog";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import type { components } from "@/types/api";

type Product = components["schemas"]["Product"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

interface ProductTableProps {
  onEdit: (product: Product) => void;
  onCreate: () => void;
  params: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
}

const columnHelper = createColumnHelper<Product>();

export function ProductTable({ onEdit, onCreate, params, onParamsChange }: ProductTableProps) {
  const { t } = useI18n();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { products, meta, isLoading, isError, error, refetch } = useProducts(params);
  const deleteMutation = useDeleteProduct();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("products.name"),
        cell: (info) => (
          <div className="font-medium max-w-[200px] truncate">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("sku", {
        header: "SKU",
        cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("price", {
        header: t("products.price"),
        cell: (info) => <span className="font-mono">${formatNumber(info.getValue() ?? 0)}</span>,
      }),
      columnHelper.accessor("stock", {
        header: t("products.stock"),
        cell: (info) => {
          const stock = info.getValue() ?? 0;
          const min = info.row.original.stock_min;
          return (
            <Badge variant={min && stock <= min ? "destructive" : stock === 0 ? "secondary" : "success"}>
              {stock}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("is_active", {
        header: t("common.status"),
        cell: (info) => (
          <StatusBadge status={info.getValue() ? "active" : "inactive"} />
        ),
      }),
      columnHelper.accessor("created_at", {
        header: t("users.createdAt"),
        cell: (info) => (
          <span className="text-muted-foreground text-xs">{formatDate(info.getValue() ?? "")}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(info.row.original)} aria-label={`Edit ${info.row.original.name ?? "product"}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(info.row.original.id!)} aria-label={`Delete ${info.row.original.name ?? "product"}`}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, t],
  );

  const table = useReactTable({
    data: products,
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
      {!isLoading && products.length === 0 ? (
        <EmptyState
          title={t("common.noData")}
          description={t("products.title")}
          action={<Button onClick={onCreate}>{t("products.create")}</Button>}
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
