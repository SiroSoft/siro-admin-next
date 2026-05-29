import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  cover_image: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  category_id: z.coerce.number().optional(),
  tag_ids: z.array(z.coerce.number()).optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(2).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  cover_image: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
  category_id: z.coerce.number().optional(),
  tag_ids: z.array(z.coerce.number()).optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
