"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/modules/categories/components/category-form";
import type { components } from "@/types/api";

type Category = components["schemas"]["Category"];

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function CategoryFormDialog({ open, onOpenChange, category, onSubmit, isPending }: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            {category ? "Update the category details below." : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
