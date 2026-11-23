import assert from 'node:assert/strict';
import test from 'node:test';

import { ShowCatalog, TvMazeClient } from '../src/catalog';


void test('TTL from completed response, concurrent refresh failure and immediate retry', async () => {
  let now = 0,
    calls = 0,
    isFailing = false;

  const load = async () => {
    calls++;
    now += 1000;
    if (isFailing) {
      throw new Error('offline');
    }

    return Response.json([]);
  };

  const catalog = new ShowCatalog({ api: new TvMazeClient({ transport: load }), now: () => now });
  const q = { q: 'night' };
  await catalog.search(q);
  now = 300_000;
  await catalog.search(q);
  assert.equal(calls, 1);
  now = 301_000;
  isFailing = true;
  const outcomes = await Promise.allSettled([catalog.search(q), catalog.search(q)]);
  assert.ok(outcomes.every((r) => r.status === 'rejected'));
  assert.equal(calls, 2);
  isFailing = false;
  await catalog.search(q);
  await new ShowCatalog({ api: new TvMazeClient({ transport: load }), now: () => now }).search(q);
  assert.equal(calls, 4);
});
void test('titles that match object properties have independent cached results', async () => {
  const titles: string[] = [];
  const catalog = new ShowCatalog({
    api: new TvMazeClient({
      transport: async (url) => {
        const title = new URL(url instanceof Request ? url.url : url).searchParams.get('q')!;
        titles.push(title);

        return Response.json([{ show: { id: 1, name: title, genres: [] } }]);
      },
    }),
  });
  for (const q of ['__proto__', 'constructor', '__proto__', 'constructor']) {
    assert.equal((await catalog.search({ q })).items[0].originalTitle, q);
  }
  assert.deepEqual(titles, ['__proto__', 'constructor']);
});
