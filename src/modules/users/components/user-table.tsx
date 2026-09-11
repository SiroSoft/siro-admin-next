"use client";

import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { DeleteDialog } from "@/components/delete-dialog";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { useServerSorting } from "@/hooks/use-server-sorting";
import type { components } from "@/types/api";

type User = components["schemas"]["User"];
type PaginationMeta = components["schemas"]["PaginationMeta"];

interface UserTableProps {
  onEdit: (user: User) => void;
  onCreate: () => void;
  params: Record<string, unknown>;
  onParamsChange: (params: Record<string, unknown>) => void;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
}

const columnHelper = createColumnHelper<User>();

export function UserTable({ onEdit, onCreate, params, onParamsChange, selectedIds = [], onSelectionChange }: UserTableProps) {
  const { t } = useI18n();
  const { sorting, handleSortingChange } = useServerSorting(onParamsChange);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { users, meta, isLoading, isError, error, refetch } = useUsers(params);
  const deleteMutation = useDeleteUser();

  const allSelected = users.length > 0 && selectedIds.length === users.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectionChange?.(users.map((u) => u.id!).filter(Boolean));
    } else {
      onSelectionChange?.([]);
    }
  }, [users, onSelectionChange]);

  const handleSelectOne = useCallback((id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedIds, id]);
    } else {
      onSelectionChange?.(selectedIds.filter((sid) => sid !== id));
    }
  }, [selectedIds, onSelectionChange]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: () => (
          <Checkbox
            checked={allSelected}
            onCheckedChange={(v) => handleSelectAll(v === true)}
            aria-label={t("a11y.selectAll")}
          />
        ),
        cell: (info) => {
          const id = info.row.original.id;
          return (
            <Checkbox
              checked={id ? selectedIds.includes(id) : false}
              onCheckedChange={(v) => id && handleSelectOne(id, v === true)}
              aria-label={t("a11y.selectRow")}
            />
          );
        },
        enableSorting: false,
      }),
      columnHelper.accessor("name", {
        header: t("users.name"),
        cell: (info) => (
          <div className="font-medium">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("email", {
        header: t("users.email"),
      }),
      columnHelper.accessor("role", {
        header: t("users.role"),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("status", {
        header: t("common.status"),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("created_at", {
        header: t("users.createdAt"),
        cell: (info) => (
          <span className="text-muted-foreground">{formatDate(info.getValue() ?? "")}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(info.row.original)} aria-label={`${t("a11y.edit")} ${info.row.original.name ?? "user"}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteId(info.row.original.id ?? null)} aria-label={`${t("a11y.delete")} ${info.row.original.name ?? "user"}`}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, selectedIds, allSelected, handleSelectAll, handleSelectOne, t],
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  if (isError) {
    return (
      <ErrorState
        message={(error as Error)?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      {!isLoading && users.length === 0 ? (
        <EmptyState
          title={t("common.noData")}
          description={t("users.title")}
          action={
            <Button onClick={onCreate}>{t("users.create")}</Button>
          }
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
            deleteMutation.mutate(deleteId, {
              onSettled: () => setDeleteId(null),
            });
          }
        }}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}

export { type UserTableProps };
