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
import { DeleteDialog } from "@/components/delete-dialog";
import { toast } from "@/hooks/use-toast";
import type { components } from "@/types/api";

type User = components["schemas"]["User"];
import { useDebounce } from "@/hooks/use-debounce";

export default function UsersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const debouncedSearch = useDebounce(search);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser(editUser?.id ?? 0);

  const params = {
    page,
    search: debouncedSearch || undefined,
    per_page: 10,
  };

  const { refetch } = useUsers(params);

  const handleEdit = useCallback((user: User) => {
    setEditUser(user);
  }, []);

  const handleCreateSubmit = useCallback(
    (data: any) => {
      createMutation.mutate(data, {
        onSuccess: () => setShowCreate(false),
      });
    },
    [createMutation],
  );

  const handleEditSubmit = useCallback(
    (data: any) => {
      updateMutation.mutate(data, {
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
      for (const id of selectedIds) {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
      }
      setSelectedIds([]);
      setShowBulkDelete(false);
      refetch();
      toast({ title: "Users deleted", description: `${selectedIds.length} user(s) have been deleted.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete some users.", variant: "destructive" });
    }
  }, [selectedIds, refetch]);

  const handleExport = useCallback(() => {
    const csvFields = ["id", "name", "email", "role", "status", "created_at"];
    const csvRows = [`${csvFields.join(",")}\n`];
    toast({ title: "Export started", description: "User data export has been initiated." });
    const blob = new Blob(csvRows, { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Users" description="Manage system users">
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search users..."
        />
        {selectedIds.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      <UserTable
        onEdit={handleEdit}
        onCreate={() => setShowCreate(true)}
        params={params}
        onParamsChange={(p) => {
          if (p.page) setPage(p.page as number);
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
