import { z } from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug: только латиница, цифры и дефис"),
  description: z.string().optional(),
  instrument: z.enum(["GUITAR", "BASS", "PIANO", "UKULELE", "GENERAL"]).default("GUITAR"),
  order: z.number().int().default(0),
  published: z.boolean().default(false),
  imageUrl: z.string().url().optional().nullable(),
});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
