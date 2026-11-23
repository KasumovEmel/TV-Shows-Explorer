import type { SearchPage } from '../../../generated/routes.schemas';
import type { PaginateShowsParams } from '../types/PaginateShowsParams';


const pageSize = 3;

export function paginateShows({ shows, genre, page }: PaginateShowsParams): SearchPage {
  const genres = [...new Set(shows.flatMap((show) => show.genres))];
  const filtered = genre ? shows.filter((show) => show.genres.includes(genre)) : shows;
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    genres,
    page,
    pageSize,
    totalBeforeFilter: shows.length,
    totalAfterFilter: filtered.length,
  };
}
