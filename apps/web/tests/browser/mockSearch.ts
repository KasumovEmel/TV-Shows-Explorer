import type { Page, Route } from '@playwright/test';

import nightShows from './night-shows.json' with { type: 'json' };
import type { Show } from '../../src/app/show';


export const searchRoute = '**/api/shows?**';

export function pageResponse(items: Show[], url: string) {
  const params = new URL(url).searchParams;
  const genre = params.get('genre');
  const page = Number(params.get('page') ?? 1);
  const filtered = genre ? items.filter((s) => s.genres.includes(genre)) : items;

  return {
    items: filtered.slice((page - 1) * 3, page * 3),
    genres: [...new Set(items.flatMap((s) => s.genres))],
    page,
    pageSize: 3,
    totalBeforeFilter: items.length,
    totalAfterFilter: filtered.length,
  };
}

export function respond(route: Route, items: Show[]) {
  return route.fulfill({ json: pageResponse(items, route.request().url()) });
}

export async function mockSearch(page: Page) {
  await page.route(searchRoute, (route) => {
    const q = new URL(route.request().url()).searchParams.get('q');
    if (q === 'night' || q === 'ноч') {
      return respond(
        route,
        nightShows.map(({ id, en, ru, rating, genres, poster, year, summary }) => ({
          id: String(id),
          originalTitle: q === 'ноч' ? ru : en,
          genres,
          poster,
          year,
          rating: rating ?? undefined,
          summary: summary ?? undefined,
        })),
      );
    }
    if (q === 'missing') {
      return respond(route, []);
    }
    const show =
      q === 'a'
        ? { id: '54198', originalTitle: 'The Bear', genres: ['Drama'] }
        : { id: '17861', originalTitle: 'Dark', genres: ['Science-Fiction'] };

    return respond(route, [show]);
  });
}
