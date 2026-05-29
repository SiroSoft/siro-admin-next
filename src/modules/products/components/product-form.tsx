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
  createProductSchema,
  updateProductSchema,
  type CreateProductFormData,
  type UpdateProductFormData,
} from "@/modules/products/schemas/product.schema";
import { useCategories } from "@/hooks/use-categories";
import type { components } from "@/types/api";

type Product = components["schemas"]["Product"];

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductFormData | UpdateProductFormData) => void;
  isPending: boolean;
}

export function ProductForm({ product, onSubmit, isPending }: ProductFormProps) {
  const isEdit = !!product;
  const { categories } = useCategories({ per_page: 100 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductFormData | UpdateProductFormData>({
    resolver: zodResolver(isEdit ? updateProductSchema : createProductSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      short_description: product?.short_description ?? "",
      price: product?.price ?? 0,
      compare_price: product?.compare_price ?? undefined,
      cost_price: product?.cost_price ?? undefined,
      sku: product?.sku ?? "",
      barcode: product?.barcode ?? "",
      stock: product?.stock ?? 0,
      stock_min: product?.stock_min ?? undefined,
      weight: product?.weight ?? undefined,
      width: product?.width ?? undefined,
      height: product?.height ?? undefined,
      length: product?.length ?? undefined,
      cover_image: product?.cover_image ?? "",
      is_active: product?.is_active ?? true,
      is_featured: product?.is_featured ?? false,
      category_id: product?.category_id ?? undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} placeholder="Product name" disabled={isPending} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" {...register("sku")} placeholder="PROD-001" disabled={isPending} />
          {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="Full product description" disabled={isPending} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="short_description">Short Description</Label>
        <Textarea id="short_description" {...register("short_description")} placeholder="Brief product summary" disabled={isPending} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input id="price" type="number" step="0.01" className="pl-7" {...register("price")} disabled={isPending} />
          </div>
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="compare_price">Compare Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input id="compare_price" type="number" step="0.01" className="pl-7" {...register("compare_price")} disabled={isPending} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost_price">Cost Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input id="cost_price" type="number" step="0.01" className="pl-7" {...register("cost_price")} disabled={isPending} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock_min">Min Stock</Label>
          <Input id="stock_min" type="number" {...register("stock_min")} disabled={isPending} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input id="weight" type="number" step="0.01" {...register("weight")} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input id="width" type="number" step="0.01" {...register("width")} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input id="height" type="number" step="0.01" {...register("height")} disabled={isPending} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input id="barcode" {...register("barcode")} disabled={isPending} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={String(watch("category_id") ?? "")} onValueChange={(v) => setValue("category_id", v ? Number(v) : undefined)} disabled={isPending}>
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
        <Label>Cover Image</Label>
        <ImageUpload value={watch("cover_image")} onChange={(v) => setValue("cover_image", v)} disabled={isPending} />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch id="is_active" checked={!!watch("is_active")} onCheckedChange={(v) => setValue("is_active", v)} disabled={isPending} />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="is_featured" checked={!!watch("is_featured")} onCheckedChange={(v) => setValue("is_featured", v)} disabled={isPending} />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Create"} Product
        </Button>
      </div>
    </form>
  );
}
