import { z } from "zod";

export const createTopicSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(1, "Название обязательно"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug: только латиница, цифры и дефис"),
  description: z.string().optional(),
  order: z.number().int().default(0),
});

export const updateTopicSchema = createTopicSchema.partial().omit({ lessonId: true });

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
