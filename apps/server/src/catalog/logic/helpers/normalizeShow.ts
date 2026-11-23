import { formatSummary } from './formatSummary';
import type { Show } from '../../../generated/routes.schemas';
import type { TvShow } from '../types/TvShow';


export function normalizeShow(show: TvShow): Show {
  return {
    id: String(show.id),
    originalTitle: show.name,
    genres: [...new Set(show.genres.map((g) => g.trim()).filter(Boolean))],
    year: show.premiered ? Number(show.premiered.slice(0, 4)) : undefined,
    poster: show.image?.medium || show.image?.original || undefined,
    rating: show.rating?.average ?? undefined,
    summary: formatSummary(show.summary),
  };
}
