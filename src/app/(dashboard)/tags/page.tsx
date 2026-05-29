"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { TagTable } from "@/modules/tags/components/tag-table";
import { TagFormDialog } from "@/modules/tags/components/tag-form-dialog";
import { useCreateTag, useUpdateTag } from "@/hooks/use-tags";
import { useDebounce } from "@/hooks/use-debounce";
import type { components } from "@/types/api";

type Tag = components["schemas"]["Tag"];

export default function TagsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const debouncedSearch = useDebounce(search);

  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag(editTag?.id ?? 0);

  const params = { page, search: debouncedSearch || undefined, per_page: 10 };

  const handleEdit = useCallback((tag: Tag) => setEditTag(tag), []);

  const handleCreateSubmit = useCallback(
    (data: any) => createMutation.mutate(data, { onSuccess: () => setShowCreate(false) }),
    [createMutation],
  );

  const handleEditSubmit = useCallback(
    (data: any) => updateMutation.mutate(data, { onSuccess: () => setEditTag(null) }),
    [updateMutation],
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Tags" description="Manage content tags">
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Tag
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search tags..." />
      </div>

      <TagTable
        onEdit={handleEdit}
        onCreate={() => setShowCreate(true)}
        params={params}
        onParamsChange={(p) => { if (p.page) setPage(p.page as number); }}
      />

      <TagFormDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
      />

      {editTag && (
        <TagFormDialog
          open={!!editTag}
          onOpenChange={() => setEditTag(null)}
          tag={editTag}
          onSubmit={handleEditSubmit}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}
