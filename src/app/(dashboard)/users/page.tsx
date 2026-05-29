"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { UserTable } from "@/modules/users/components/user-table";
import { UserFormDialog } from "@/modules/users/components/user-form-dialog";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import type { components } from "@/types/api";

type User = components["schemas"]["User"];
import { useDebounce } from "@/hooks/use-debounce";

export default function UsersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const debouncedSearch = useDebounce(search);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser(editUser?.id ?? 0);

  const params = {
    page,
    search: debouncedSearch || undefined,
    per_page: 10,
  };

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

  return (
    <div className="space-y-4">
      <PageHeader title="Users" description="Manage system users">
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search users..."
        />
      </div>

      <UserTable
        onEdit={handleEdit}
        onCreate={() => setShowCreate(true)}
        params={params}
        onParamsChange={(p) => {
          if (p.page) setPage(p.page as number);
        }}
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
    </div>
  );
}
