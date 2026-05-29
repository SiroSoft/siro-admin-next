import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  compare_price: z.coerce.number().min(0).optional(),
  cost_price: z.coerce.number().min(0).optional(),
  sku: z.string().min(1, "SKU is required"),
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
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  compare_price: z.coerce.number().min(0).optional(),
  cost_price: z.coerce.number().min(0).optional(),
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
