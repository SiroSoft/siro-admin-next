"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/modules/categories/components/category-form";
import { useI18n } from "@/providers/i18n-provider";
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
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{category ? t("categories.edit") : t("categories.create")}</DialogTitle>
          <DialogDescription>
            {category ? t("categories.edit") : t("categories.create")}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
