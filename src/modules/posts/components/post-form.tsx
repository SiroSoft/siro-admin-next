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
import {
  createPostSchema,
  updatePostSchema,
  type CreatePostFormData,
  type UpdatePostFormData,
} from "@/modules/posts/schemas/post.schema";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import type { components } from "@/types/api";

type Post = components["schemas"]["Post"];

interface PostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostFormData | UpdatePostFormData) => void;
  isPending: boolean;
}

export function PostForm({ post, onSubmit, isPending }: PostFormProps) {
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
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} placeholder="Post title" disabled={isPending} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" {...register("excerpt")} placeholder="Brief description" disabled={isPending} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <textarea
          id="content"
          {...register("content")}
          className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Post content..."
          disabled={isPending}
        />
        {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <ImageUpload value={watch("cover_image") ?? ""} onChange={(v) => setValue("cover_image", v)} disabled={isPending} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={watch("status")} onValueChange={(v) => setValue("status", v as "draft" | "published" | "archived")} disabled={isPending}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={watch("category_id") ? String(watch("category_id")) : ""}
            onValueChange={(v) => setValue("category_id", v ? Number(v) : undefined)}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
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
          {isEdit ? "Update" : "Create"} Post
        </Button>
      </div>
    </form>
  );
}
