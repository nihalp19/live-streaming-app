import { z } from 'zod';

export const createStreamSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).nullish(),
});

export type CreateStreamInput = z.infer<typeof createStreamSchema>;