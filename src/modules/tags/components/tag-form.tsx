"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createTagSchema,
  updateTagSchema,
  type CreateTagFormData,
  type UpdateTagFormData,
} from "@/modules/tags/schemas/tag.schema";
import type { components } from "@/types/api";

type Tag = components["schemas"]["Tag"];

interface TagFormProps {
  tag?: Tag;
  onSubmit: (data: CreateTagFormData | UpdateTagFormData) => void;
  isPending: boolean;
}

export function TagForm({ tag, onSubmit, isPending }: TagFormProps) {
  const isEdit = !!tag;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTagFormData | UpdateTagFormData>({
    resolver: zodResolver(isEdit ? updateTagSchema : createTagSchema),
    defaultValues: {
      name: tag?.name ?? "",
      color: tag?.color ?? "",
      description: (tag as Record<string, unknown>)?.description as string ?? "",
      is_active: (tag as Record<string, unknown>)?.is_active as boolean ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register("name")} placeholder="Tag name" disabled={isPending} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

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
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="Tag description" disabled={isPending} />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="is_active" checked={!!watch("is_active")} onCheckedChange={(v) => setValue("is_active", v)} disabled={isPending} />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Create"} Tag
        </Button>
      </div>
    </form>
  );
}
