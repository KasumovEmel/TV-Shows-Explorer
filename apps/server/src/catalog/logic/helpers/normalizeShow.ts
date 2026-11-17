import { summary } from './summary';
import type { Show } from '../../../generated/routes.schemas';
import type { TvShow } from '../api/types';


export function normalizeShow(show: TvShow): Show {
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
