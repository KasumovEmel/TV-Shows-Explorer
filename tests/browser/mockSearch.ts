import nightShows from './night-shows.json' with { type: 'json' };

import type { Page } from '@playwright/test';


export const searchRoute = 'https://api.tvmaze.com/search/shows?**';

export async function mockSearch(page: Page) {
  await page.route(searchRoute, (route) => {
    const q = new URL(route.request().url()).searchParams.get('q');
    if (q === 'night' || q === 'ноч') {
      const json = nightShows.map(({ id, en, ru, genres, year, poster, rating, summary }) => ({
        show: {
          id,
          name: q === 'ноч' ? ru : en,
          genres,
          rating: { average: rating },
          summary,
          premiered: year + '-01-01',
          image: { medium: poster, original: poster },
        },
      }));

      return route.fulfill({ json });
    }
    const show =
      q === 'a'
        ? { id: 54198, name: 'The Bear', genres: ['Drama'] }
        : { id: 17861, name: 'Dark', genres: ['Science-Fiction'] };

    return route.fulfill({ json: [{ show: { ...show, premiered: null, image: null } }] });
  });
}
