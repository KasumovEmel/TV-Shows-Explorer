import { z } from 'zod';


export const tvShow = z.object({
  id: z.int().positive(),
  name: z.string().trim().min(1),
  genres: z.array(z.string()),
  premiered: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullish(),
  image: z.object({ medium: z.string().nullish(), original: z.string().nullish() }).nullish(),
  rating: z.object({ average: z.number().nullish() }).nullish(),
  summary: z.string().nullish(),
});
