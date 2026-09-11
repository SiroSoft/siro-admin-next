import { z } from "zod";
import { tSchema } from "@/lib/i18n";

export const createProductSchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin2")),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.coerce.number().min(0, tSchema("validation.priceMin")),
  compare_price: z.coerce.number().min(0).optional(),
  cost_price: z.coerce.number().min(0).optional(),
  sku: z.string().min(1, tSchema("validation.skuRequired")),
  barcode: z.string().optional(),
  stock: z.coerce.number().int().default(0),
  stock_min: z.coerce.number().int().optional(),
  weight: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  cover_image: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  category_id: z.coerce.number().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin2")).optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.coerce.number().min(0, tSchema("validation.priceMin")).optional(),
  compare_price: z.coerce.number().min(0, tSchema("validation.priceMin")).optional(),
  cost_price: z.coerce.number().min(0, tSchema("validation.priceMin")).optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.coerce.number().int().optional(),
  stock_min: z.coerce.number().int().optional(),
  weight: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  cover_image: z.string().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  category_id: z.coerce.number().optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
