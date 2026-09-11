"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { UserTable } from "@/modules/users/components/user-table";
import { UserFormDialog } from "@/modules/users/components/user-form-dialog";
import { useCreateUser, useUpdateUser, useUsers } from "@/hooks/use-users";
import { useI18n } from "@/providers/i18n-provider";
import { DeleteDialog } from "@/components/delete-dialog";
import { toast } from "@/hooks/use-toast";
import type { components } from "@/types/api";
import type { CreateUserFormData, UpdateUserFormData } from "@/modules/users/schemas/user.schema";

type User = components["schemas"]["User"];
export default function UsersPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<string | undefined>(undefined);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser(editUser?.id ?? 0);

  const params = {
    page,
    search: search || undefined,
    per_page: 10,
    sort,
    order,
  };

  const { users, refetch } = useUsers(params);

  const handleEdit = useCallback((user: User) => {
    setEditUser(user);
  }, []);

  const handleCreateSubmit = useCallback(
    (data: CreateUserFormData | UpdateUserFormData) => {
      createMutation.mutate(data as components["schemas"]["CreateUserRequest"], {
        onSuccess: () => setShowCreate(false),
      });
    },
    [createMutation],
  );

  const handleEditSubmit = useCallback(
    (data: CreateUserFormData | UpdateUserFormData) => {
      updateMutation.mutate(data as components["schemas"]["UpdateUserRequest"], {
        onSuccess: () => setEditUser(null),
      });
    },
    [updateMutation],
  );

  const handleSelectionChange = useCallback((ids: number[]) => {
    setSelectedIds(ids);
  }, []);

  const handleBulkDelete = useCallback(() => {
    setShowBulkDelete(true);
  }, []);

  const confirmBulkDelete = useCallback(async () => {
    try {
      const { usersService } = await import("@/services/users.service");
      await Promise.all(selectedIds.map((id) => usersService.delete(id)));
      setSelectedIds([]);
      setShowBulkDelete(false);
      refetch();
      toast({ title: t("users.deleted"), description: `${selectedIds.length} ${t("users.deletedDescription")}` });
    } catch {
      toast({ title: "Error", description: "Failed to delete some users.", variant: "destructive" });
    }
  }, [selectedIds, refetch]);

  const handleExport = useCallback(() => {
    const csvFields = ["id", "name", "email", "role", "status", "created_at"];
    const csvRows = [csvFields.join(",")];
    for (const user of users) {
      csvRows.push(
        [
          user.id ?? "",
          `"${(user.name ?? "").replace(/"/g, '""')}"`,
          `"${(user.email ?? "").replace(/"/g, '""')}"`,
          user.role ?? "",
          user.status ?? "",
          user.created_at ?? "",
        ].join(","),
      );
    }
    toast({ title: t("users.exportStarted"), description: `${users.length} ${t("users.exportStartedDescription")}` });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [users]);

  return (
    <div className="space-y-4">
      <PageHeader title={t("users.title")} description={t("users.title")}>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          {t("common.export")}
        </Button>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("users.create")}
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder={t("common.search") + " " + t("users.title") + "..."}
        />
        {selectedIds.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("common.delete")} ({selectedIds.length})
          </Button>
        )}
      </div>

      <UserTable
        onEdit={handleEdit}
        onCreate={() => setShowCreate(true)}
        params={params}
        onParamsChange={(p) => {
          if (p.page) setPage(p.page as number);
          if ("sort" in p) setSort(p.sort as string | undefined);
          if ("order" in p) setOrder(p.order as string | undefined);
        }}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
      />

      <UserFormDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
      />

      {editUser && (
        <UserFormDialog
          open={!!editUser}
          onOpenChange={() => setEditUser(null)}
          user={editUser}
          onSubmit={handleEditSubmit}
          isPending={updateMutation.isPending}
        />
      )}

      <DeleteDialog
        open={showBulkDelete}
        onOpenChange={setShowBulkDelete}
        onConfirm={confirmBulkDelete}
        isPending={false}
      />
    </div>
  );
}
