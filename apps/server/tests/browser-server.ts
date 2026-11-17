import { serve } from '@hono/node-server';

import shows from '../../web/tests/browser/night-shows.json' with { type: 'json' };
import { createApp } from '../src/app';
import { ShowCatalog, TvMazeClient } from '../src/catalog';
import { FavoritesStore } from '../src/favorites';


const catalog = new ShowCatalog({
  api: new TvMazeClient({
    transport: async (url) => {
      const path = new URL(url instanceof Request ? url.url : url.toString());
      const rows = shows.map((s) => ({
        id: s.id,
        name: s.en,
        genres: s.genres,
        premiered: s.year + '-01-01',
        summary: s.summary,
        rating: { average: s.rating },
        image: { medium: s.poster },
      }));
      if (path.pathname === '/search/shows') {
        return Response.json(rows.map((show) => ({ show })));
      }
      const row = rows.find((r) => String(r.id) === path.pathname.split('/').at(-1));

      return row ? Response.json(row) : new Response(null, { status: 404 });
    },
  }),
});
serve({
  fetch: createApp({ catalog, favorites: new FavoritesStore({ path: ':memory:' }) }).fetch,
  hostname: '127.0.0.1',
  port: 4818,
});
