"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryFormData,
  type UpdateCategoryFormData,
} from "@/modules/categories/schemas/category.schema";
import type { components } from "@/types/api";

type Category = components["schemas"]["Category"];

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryFormData | UpdateCategoryFormData) => void;
  isPending: boolean;
}

export function CategoryForm({ category, onSubmit, isPending }: CategoryFormProps) {
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register("name")} placeholder="Category name" />
        {(errors as any).name && <p className="text-sm text-destructive">{(errors as any).name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} placeholder="Category description" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" {...register("icon")} placeholder="icon-name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" {...register("color")} placeholder="#6366f1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="parent_id">Parent ID</Label>
          <Input id="parent_id" type="number" {...register("parent_id")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input id="sort_order" type="number" {...register("sort_order")} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="is_active" checked={watch("is_active")} onCheckedChange={(v) => setValue("is_active", v)} />
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
