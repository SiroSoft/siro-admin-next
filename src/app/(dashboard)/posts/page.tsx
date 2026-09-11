"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { PostTable } from "@/modules/posts/components/post-table";
import { PostFormDialog } from "@/modules/posts/components/post-form-dialog";
import { useCreatePost, useUpdatePost } from "@/hooks/use-posts";
import { useI18n } from "@/providers/i18n-provider";
import type { components } from "@/types/api";
import type { CreatePostFormData, UpdatePostFormData } from "@/modules/posts/schemas/post.schema";

type Post = components["schemas"]["Post"];

export default function PostsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<string | undefined>(undefined);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost(editPost?.id ?? 0);

  const params = { page, search: search || undefined, per_page: 10 };

  const handleEdit = useCallback((post: Post) => setEditPost(post), []);

  const handleCreateSubmit = useCallback(
    (data: CreatePostFormData | UpdatePostFormData) => createMutation.mutate(data as components["schemas"]["CreatePostRequest"], { onSuccess: () => setShowCreate(false) }),
    [createMutation],
  );

  const handleEditSubmit = useCallback(
    (data: CreatePostFormData | UpdatePostFormData) => updateMutation.mutate(data as components["schemas"]["UpdatePostRequest"], { onSuccess: () => setEditPost(null) }),
    [updateMutation],
  );

  return (
    <div className="space-y-4">
      <PageHeader title={t("posts.title")} description={t("posts.title")}>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("posts.create")}
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={t("common.search") + " " + t("posts.title") + "..."} />
      </div>

      <PostTable
        onEdit={handleEdit}
        onCreate={() => setShowCreate(true)}
        params={params}
        onParamsChange={(p) => { if (p.page) setPage(p.page as number);
          if ("sort" in p) setSort(p.sort as string | undefined);
          if ("order" in p) setOrder(p.order as string | undefined); }}
      />

      <PostFormDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
      />

      {editPost && (
        <PostFormDialog
          open={!!editPost}
          onOpenChange={() => setEditPost(null)}
          post={editPost}
          onSubmit={handleEditSubmit}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}
