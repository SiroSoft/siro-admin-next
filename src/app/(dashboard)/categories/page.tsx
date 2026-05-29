"use client";

import { useState, useCallback } from "react";
import { Plus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { CategoryTable } from "@/modules/categories/components/category-table";
import { CategoryFormDialog } from "@/modules/categories/components/category-form-dialog";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import type { components } from "@/types/api";

type Category = components["schemas"]["Category"];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(editCategory?.id ?? 0);

  const params = { page, search: search || undefined, per_page: 10 };

  const handleEdit = useCallback((category: Category) => setEditCategory(category), []);

  const handleCreateSubmit = useCallback(
    (data: any) => createMutation.mutate(data, { onSuccess: () => setShowCreate(false) }),
    [createMutation],
  );

  const handleEditSubmit = useCallback(
    (data: any) => updateMutation.mutate(data, { onSuccess: () => setEditCategory(null) }),
    [updateMutation],
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Categories" description="Manage content categories">
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search categories..." />
      </div>

      <CategoryTable
        onEdit={handleEdit}
        onCreate={() => setShowCreate(true)}
        params={params}
        onParamsChange={(p) => { if (p.page) setPage(p.page as number); }}
      />

      <CategoryFormDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
      />

      {editCategory && (
        <CategoryFormDialog
          open={!!editCategory}
          onOpenChange={() => setEditCategory(null)}
          category={editCategory}
          onSubmit={handleEditSubmit}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}
