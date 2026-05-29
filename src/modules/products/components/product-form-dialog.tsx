"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "@/modules/products/components/product-form";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Create Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update the product details below." : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>
        <ProductForm product={product} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
