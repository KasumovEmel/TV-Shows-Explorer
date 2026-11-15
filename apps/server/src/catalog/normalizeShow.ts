import { z } from 'zod';

import { summary } from './summary';
import type { Show } from '../generated/routes.schemas';


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

export function normalizeShow(show: z.infer<typeof tvShow>): Show {
  return {
    id: String(show.id),
    originalTitle: show.name,
    genres: [...new Set(show.genres.map((g) => g.trim()).filter(Boolean))],
    year: show.premiered ? Number(show.premiered.slice(0, 4)) : undefined,
    poster: show.image?.medium || show.image?.original || undefined,
    rating: show.rating?.average ?? undefined,
    summary: summary(show.summary),
  };
}
