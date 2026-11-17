import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../src/app';
import { ShowCatalog, TvMazeClient } from '../src/catalog';
import { FavoritesStore } from '../src/favorites';


void test('TVmaze errors, timeout and malformed records have safe envelopes', async () => {
  const cases = [
    [async () => new Response(null, { status: 429, headers: { 'Retry-After': '12' } }), 429],
    [async () => Response.json([{ show: { name: 'no id' } }]), 502],
    [
      // oxlint-disable-next-line project/object-parameters -- Подставной транспорт реализует сигнатуру fetch.
      async (_: Parameters<typeof fetch>[0], opts?: RequestInit) =>
        new Promise<Response>((_, reject) =>
          opts?.signal?.addEventListener('abort', () => reject(new Error('timeout'))),
        ),
      504,
    ],
  ] as const;
  const keepAlive = setTimeout(() => {}, 1000);
  try {
    for (const [transport, status] of cases) {
      const app = createApp({
        catalog: new ShowCatalog({ api: new TvMazeClient({ transport, timeout: 5 }) }),
        favorites: new FavoritesStore({ path: ':memory:' }),
      });
      const r = await app.request('/api/shows?q=night');
      assert.equal(r.status, status);
      assert.deepEqual(Object.keys(await r.json()).sort(), ['code', 'message']);
      if (status === 429) {
        assert.equal(r.headers.get('Retry-After'), '12');
      }
    }
  } finally {
    clearTimeout(keepAlive);
  }
});
void test('normalizes TVmaze HTML, missing metadata and zero rating', async () => {
  const catalog = new ShowCatalog({
    api: new TvMazeClient({
      transport: async () =>
        Response.json([
          {
            show: {
              id: 1,
              name: ' Signal ',
              genres: [' Drama', 'Drama'],
              rating: { average: 0 },
              summary: '<p>A &amp; B</p><script>skip()</script><p>' + 'again '.repeat(55) + '</p>',
            },
          },
          { show: { id: 2, name: 'Quiet', genres: [] } },
        ]),
    }),
  });
  const { items } = await catalog.search({ q: 'signal' });
  assert.equal(items[0].rating, 0);
  assert.deepEqual(items[0].genres, ['Drama']);
  assert.match(items[0].summary!, /^A & B( again)+…$/);
  assert.ok(items[0].summary!.length <= 160);
  assert.equal(items[1].summary, undefined);
  assert.equal(items[1].year, undefined);
});
