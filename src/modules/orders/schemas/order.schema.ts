import { z } from "zod";
import { tSchema } from "@/lib/i18n";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.number({ invalid_type_error: tSchema("validation.productRequired") }),
        quantity: z.number().min(1, tSchema("validation.quantityMin")),
      }),
    )
    .min(1, tSchema("validation.itemsMin")),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
  notes: z.string().optional(),
  payment_method: z.string().optional(),
  status: z.string().optional(),
  customer_id: z.coerce.number().optional(),
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).optional(),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
