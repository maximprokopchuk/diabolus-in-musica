import { z } from "zod";

export const createTheoryBlockSchema = z.object({
  topicId: z.string().min(1),
  type: z.enum(["TEXT", "IMAGE", "NOTATION", "CODE_EXAMPLE"]).default("TEXT"),
  content: z.string().min(1, "Контент обязателен"),
  order: z.number().int().default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const updateTheoryBlockSchema = createTheoryBlockSchema
  .partial()
  .omit({ topicId: true });

export type CreateTheoryBlockInput = z.infer<typeof createTheoryBlockSchema>;
export type UpdateTheoryBlockInput = z.infer<typeof updateTheoryBlockSchema>;
