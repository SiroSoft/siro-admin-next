import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.number({ invalid_type_error: "Product is required" }),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one item is required"),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
  notes: z.string().optional(),
  payment_method: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).optional(),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
