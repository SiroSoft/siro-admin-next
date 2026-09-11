import { z } from "zod";
import { tSchema } from "@/lib/i18n";

export const createTagSchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin2")),
  color: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const updateTagSchema = z.object({
  name: z.string().min(2, tSchema("validation.nameMin2")).optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type CreateTagFormData = z.infer<typeof createTagSchema>;
export type UpdateTagFormData = z.infer<typeof updateTagSchema>;
