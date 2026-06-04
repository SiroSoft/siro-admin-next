"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "@/modules/products/components/product-form";
import { useI18n } from "@/providers/i18n-provider";
import type { components } from "@/types/api";

type Product = components["schemas"]["Product"];

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function ProductFormDialog({ open, onOpenChange, product, onSubmit, isPending }: ProductFormDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? t("products.edit") : t("products.create")}</DialogTitle>
          <DialogDescription>
            {product ? t("products.edit") : t("products.create")}
          </DialogDescription>
        </DialogHeader>
        <ProductForm product={product} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
