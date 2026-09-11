"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  createPostSchema,
  updatePostSchema,
  type CreatePostFormData,
  type UpdatePostFormData,
} from "@/modules/posts/schemas/post.schema";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import { useI18n } from "@/providers/i18n-provider";
import type { components } from "@/types/api";

type Post = components["schemas"]["Post"];

interface PostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostFormData | UpdatePostFormData) => void;
  isPending: boolean;
}

export function PostForm({ post, onSubmit, isPending }: PostFormProps) {
  const { t } = useI18n();
  const isEdit = !!post;
  const { categories } = useCategories({ per_page: 100 });
  const { tags } = useTags({ per_page: 200 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePostFormData | UpdatePostFormData>({
    resolver: zodResolver(isEdit ? updatePostSchema : createPostSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
      excerpt: post?.excerpt ?? "",
      cover_image: post?.cover_image ?? "",
      status: post?.status ?? "draft",
      featured: post?.featured ?? false,
      category_id: post?.category_id ?? undefined,
      tag_ids: post?.tags?.map((t) => t.id!).filter(Boolean) ?? [],
    },
  });

  const selectedTagIds = watch("tag_ids") ?? [];

  const toggleTag = (tagId: number) => {
    const current = selectedTagIds;
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    setValue("tag_ids", updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <Label htmlFor="title">{t("posts.title_field")} *</Label>
        <Input id="title" {...register("title")} placeholder={t("forms.postTitle")} disabled={isPending} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" {...register("excerpt")} placeholder={t("forms.postExcerpt")} disabled={isPending} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">{t("posts.content")} *</Label>
        <RichTextEditor
          value={watch("content") ?? ""}
          onChange={(html) => setValue("content", html, { shouldValidate: true })}
          placeholder={t("forms.postContent")}
          disabled={isPending}
          error={errors.content?.message}
          minHeight={300}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("products.image")}</Label>
        <ImageUpload value={watch("cover_image") ?? ""} onChange={(v) => setValue("cover_image", v)} disabled={isPending} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("common.status")}</Label>
          <Select value={watch("status")} onValueChange={(v) => setValue("status", v as "draft" | "published" | "archived")} disabled={isPending}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{t("posts.status_draft")}</SelectItem>
              <SelectItem value="published">{t("posts.status_published")}</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("products.category")}</Label>
          <Select
            value={watch("category_id") ? String(watch("category_id")) : ""}
            onValueChange={(v) => setValue("category_id", v ? Number(v) : undefined)}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("forms.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button
              key={tag.id}
              type="button"
              variant={selectedTagIds.includes(tag.id!) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag.id!)}
              disabled={isPending}
            >
              {tag.name}
            </Button>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground">No tags available</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="featured" checked={!!watch("featured")} onCheckedChange={(v) => setValue("featured", v)} disabled={isPending} />
        <Label htmlFor="featured">Featured</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? t("common.save") : t("common.create")}
        </Button>
      </div>
    </form>
  );
}
