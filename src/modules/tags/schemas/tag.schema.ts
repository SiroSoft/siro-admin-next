import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  color: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const updateTagSchema = z.object({
  name: z.string().min(2).optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type CreateTagFormData = z.infer<typeof createTagSchema>;
export type UpdateTagFormData = z.infer<typeof updateTagSchema>;
