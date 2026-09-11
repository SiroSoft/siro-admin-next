import { z } from "zod";
import { tSchema } from "@/lib/i18n";

export const createCategorySchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin2")),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parent_id: z.coerce.number().optional(),
  sort_order: z.coerce.number().int().optional(),
  is_active: z.boolean().default(true),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin2")).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  parent_id: z.coerce.number().optional(),
  sort_order: z.coerce.number().int().optional(),
  is_active: z.boolean().optional(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
