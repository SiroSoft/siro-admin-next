"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEdit ? updateTagSchema : createTagSchema),
    defaultValues: {
      name: tag?.name ?? "",
      color: tag?.color ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register("name")} placeholder="Tag name" />
        {(errors as any).name && <p className="text-sm text-destructive">{(errors as any).name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input id="color" {...register("color")} placeholder="#6366f1" />
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
