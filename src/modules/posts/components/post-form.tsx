"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createPostSchema,
  updatePostSchema,
  type CreatePostFormData,
  type UpdatePostFormData,
} from "@/modules/posts/schemas/post.schema";
import type { components } from "@/types/api";

type Post = components["schemas"]["Post"];

interface PostFormProps {
  post?: Post;
  onSubmit: (data: CreatePostFormData | UpdatePostFormData) => void;
  isPending: boolean;
}

export function PostForm({ post, onSubmit, isPending }: PostFormProps) {
  const isEdit = !!post;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEdit ? updatePostSchema : createPostSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
      excerpt: post?.excerpt ?? "",
      cover_image: post?.cover_image ?? "",
      status: post?.status ?? "draft",
      featured: post?.featured ?? false,
      category_id: post?.category_id ?? undefined,
      tag_ids: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} placeholder="Post title" />
        {(errors as any).title && <p className="text-sm text-destructive">{(errors as any).title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input id="excerpt" {...register("excerpt")} placeholder="Brief description" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <textarea
          id="content"
          {...register("content")}
          className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Post content..."
        />
        {(errors as any).content && <p className="text-sm text-destructive">{(errors as any).content.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image">Cover Image URL</Label>
        <Input id="cover_image" {...register("cover_image")} placeholder="https://..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={watch("status")} onValueChange={(v) => setValue("status", v)}>
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
          <Label htmlFor="category_id">Category ID</Label>
          <Input id="category_id" type="number" {...register("category_id")} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="featured" checked={watch("featured")} onCheckedChange={(v) => setValue("featured", v)} />
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
