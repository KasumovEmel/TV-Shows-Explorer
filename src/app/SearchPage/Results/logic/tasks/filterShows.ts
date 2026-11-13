import type { Show } from '../show';


export function filterShows(shows: Show[], genre: string) {
  const genres = [...new Set(shows.flatMap((show) => show.genres))];
  const cards = genre ? shows.filter((show) => show.genres.includes(genre)) : shows;

  return { genres, cards };
}
