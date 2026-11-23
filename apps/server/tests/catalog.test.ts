import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../src/app';
import { ShowCatalog, TvMazeClient } from '../src/catalog';
import { FavoritesStore } from '../src/favorites';
import type { CatalogRequest, ShowId } from './types';


const records = Array.from({ length: 7 }, (_, i) => ({
  show: { id: i + 1, name: 'Night ' + i, genres: i === 6 ? ['Comedy', 'Drama'] : ['Drama'] },
}));
void test('all genres before paging, validation, cancellation and shared request', async () => {
  let calls = 0;
  const gate = Promise.withResolvers<void>();
  const app = createApp({
    catalog: new ShowCatalog({
      api: new TvMazeClient({
        transport: async () => {
          calls++;
          await gate.promise;

          return Response.json(records);
        },
      }),
    }),
    favorites: new FavoritesStore(),
  });
  for (const query of ['', '?q=%20', '?q=x&page=0', '?q=x&page=1.1', '?q=x&page=no']) {
    const r = await app.request('/api/shows' + query);
    assert.equal(r.status, 400);
    assert.equal((await r.json()).code, 'invalid_input');
  }
  assert.equal(calls, 0);
  const controller = new AbortController();

  const get = ({ suffix, profile = 'one' }: CatalogRequest) =>
    app.request('/api/shows?q=%20night%20' + suffix, {
      headers: { cookie: 'season_one=' + profile },
    });

  const first = app.request('/api/shows?q=night', { signal: controller.signal });
  const second = get({ suffix: '&page=2', profile: 'two' });
  controller.abort();
  gate.resolve();
  const [one, two] = await Promise.all([first, second]);
  assert.deepEqual(await one.json(), {
    items: records
      .slice(0, 3)
      .map(({ show }) => ({ id: String(show.id), originalTitle: show.name, genres: show.genres })),
    genres: ['Drama', 'Comedy'],
    page: 1,
    pageSize: 3,
    totalBeforeFilter: 7,
    totalAfterFilter: 7,
  });
  assert.deepEqual(
    (await two.json()).items.map((s: ShowId) => s.id),
    ['4', '5', '6'],
  );
  assert.equal((await (await get({ suffix: '&page=3' })).json()).items.length, 1);
  for (const [suffix, count, items] of [
    ['&genre=Comedy', 1, 1],
    ['&genre=Comedy&page=2', 1, 0],
    ['&genre=Missing', 0, 0],
  ] as const) {
    const page = await (await get({ suffix })).json();
    assert.equal(page.totalAfterFilter, count);
    assert.equal(page.totalBeforeFilter, 7);
    assert.equal(page.items.length, items);
    assert.deepEqual(page.genres, ['Drama', 'Comedy']);
  }
  const saved = await app.request('/api/favorites/7', { method: 'PUT' });
  assert.equal(saved.status, 204);
  assert.equal(calls, 1);
});
