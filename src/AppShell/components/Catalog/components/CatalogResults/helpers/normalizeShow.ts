import type { TVmazeShow } from '../types';
import type { Show } from '@shared/types/show';


export function normalizeShow(show: TVmazeShow): Show {
  return {
    id: String(show.id),
    originalTitle: show.name.trim(),
    genres: [...new Set(show.genres.map((genre) => genre.trim()).filter(Boolean))],
    year: show.premiered ? Number(show.premiered.slice(0, 4)) : undefined,
    poster: show.image?.medium || show.image?.original || undefined,
  };
}
