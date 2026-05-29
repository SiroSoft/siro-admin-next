import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  color: z.string().optional(),
});

export const updateTagSchema = z.object({
  name: z.string().min(2).optional(),
  color: z.string().optional(),
});

export type CreateTagFormData = z.infer<typeof createTagSchema>;
export type UpdateTagFormData = z.infer<typeof updateTagSchema>;
