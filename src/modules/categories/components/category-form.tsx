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
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryFormData,
  type UpdateCategoryFormData,
} from "@/modules/categories/schemas/category.schema";
import { useCategories } from "@/hooks/use-categories";
import type { components } from "@/types/api";

type Category = components["schemas"]["Category"];

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryFormData | UpdateCategoryFormData) => void;
  isPending: boolean;
}

export function CategoryForm({ category, onSubmit, isPending }: CategoryFormProps) {
  const isEdit = !!category;
  const { categories } = useCategories({ per_page: 100 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryFormData | UpdateCategoryFormData>({
    resolver: zodResolver(isEdit ? updateCategorySchema : createCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "",
      color: category?.color ?? "",
      parent_id: category?.parent_id ?? undefined,
      sort_order: category?.sort_order ?? 0,
      is_active: category?.is_active ?? true,
    },
  });

  const parentCategories = categories.filter((cat) => !isEdit || cat.id !== category?.id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register("name")} placeholder="Category name" disabled={isPending} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="Category description" disabled={isPending} />
      </div>

      <div className="space-y-2">
        <Label>Image</Label>
        <ImageUpload value={watch("icon") ?? ""} onChange={(v) => setValue("icon", v)} disabled={isPending} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <div className="flex gap-2">
            <input
              id="color"
              type="color"
              value={watch("color") || "#6366f1"}
              onChange={(e) => setValue("color", e.target.value)}
              className="h-9 w-12 rounded-md border border-input bg-transparent px-1 disabled:opacity-50"
              disabled={isPending}
            />
            <Input
              {...register("color")}
              placeholder="#6366f1"
              className="flex-1"
              disabled={isPending}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input id="sort_order" type="number" {...register("sort_order")} disabled={isPending} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Parent Category</Label>
        <Select
          value={watch("parent_id") ? String(watch("parent_id")) : ""}
          onValueChange={(v) => setValue("parent_id", v ? Number(v) : undefined)}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="None (top level)" />
          </SelectTrigger>
          <SelectContent>
            {parentCategories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="is_active" checked={!!watch("is_active")} onCheckedChange={(v) => setValue("is_active", v)} disabled={isPending} />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Create"} Category
        </Button>
      </div>
    </form>
  );
}
