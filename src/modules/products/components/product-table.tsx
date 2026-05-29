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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { products, meta, isLoading, isError, error, refetch } = useProducts(params);
  const deleteMutation = useDeleteProduct();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="font-medium max-w-[200px] truncate">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("sku", {
        header: "SKU",
        cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => <span className="font-mono">${formatNumber(info.getValue() ?? 0)}</span>,
      }),
      columnHelper.accessor("stock", {
        header: "Stock",
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
        header: "Status",
        cell: (info) => (
          <StatusBadge status={info.getValue() ? "active" : "inactive"} />
        ),
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
          title="No products found"
          description="Get started by creating your first product."
          action={<Button onClick={onCreate}>Create Product</Button>}
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
