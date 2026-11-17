import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createApp } from '../src/app';
import { ShowCatalog, TvMazeClient } from '../src/catalog';
import { FavoritesStore, sessionLifetimeSeconds } from '../src/favorites';
import type { FavoriteRequest, ShowId } from './types';


void test('anonymous sessions, snapshots, fixed expiry and durable idempotent mutations', async () => {
  let now = 0,
    calls = 0,
    offline = false;
  const file = join(mkdtempSync(join(tmpdir(), 'season-one-')), 'db');
  const catalog = new ShowCatalog({
    api: new TvMazeClient({
      transport: async (url) => {
        calls++;
        if (offline) {
          throw new Error('offline');
        }
        const id = Number(url instanceof Request ? url.url : url.toString().split('/').at(-1));
        if (id === 9) {
          return new Response(null, { status: 404 });
        }

        return Response.json({ id, name: 'Show ' + id, genres: [] });
      },
    }),
    now: () => now,
  });
  let store = new FavoritesStore({ path: file, now: () => now });
  let app = createApp({ catalog, favorites: store, secure: true });

  const req = ({ cookie = '', path = '', method = 'GET' }: FavoriteRequest = {}) =>
    app.request('/api/favorites' + path, { method, headers: { cookie } });

  const count = async (c = '') => {
    const response = await req({ cookie: c, path: '/count' });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('set-cookie'), null);

    return response.json();
  };

  assert.deepEqual(await count(), { count: 0 });
  const first = await req(),
    other = await req();
  const set = first.headers.get('set-cookie')!;
  for (const attr of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Max-Age=2592000', 'Path=/']) {
    assert.ok(set.includes(attr));
  }
  const cookie = set.split(';')[0],
    second = other.headers.get('set-cookie')!.split(';')[0];
  assert.notEqual(cookie, second);
  assert.equal(first.headers.get('cache-control'), 'private, no-store');
  assert.equal((await req({ cookie, path: '/bad', method: 'PUT' })).status, 400);
  assert.equal((await req({ cookie, path: '/9', method: 'PUT' })).status, 404);

  const put = () => req({ cookie, path: '/1', method: 'PUT' });

  const pair = await Promise.all([put(), put()]);
  assert.ok(pair.every((r) => r.status === 204));
  assert.equal(calls, 2);
  await req({ cookie, path: '/2', method: 'PUT' });
  await put();
  assert.equal(calls, 3);

  const ids = async (c: string) =>
    (await (await req({ cookie: c })).json()).items.map((s: ShowId) => s.id);

  assert.deepEqual(await ids(second), []);
  assert.deepEqual(await ids(cookie), ['2', '1']);
  assert.deepEqual(await count(second), { count: 0 });
  assert.deepEqual(await count(cookie), { count: 2 });
  store.close();
  now += 29 * 86400_000;
  offline = true;
  store = new FavoritesStore({ path: file, now: () => now });
  app = createApp({ catalog, favorites: store, secure: true });
  assert.deepEqual(await ids(cookie), ['2', '1']);
  assert.equal((await put()).status, 204);
  assert.equal((await req({ cookie })).headers.get('set-cookie'), null);
  for (let i = 0; i < 2; i++) {
    assert.equal((await req({ cookie, path: '/2', method: 'DELETE' })).status, 204);
  }
  assert.deepEqual(await ids(cookie), ['1']);
  assert.deepEqual(await count(cookie), { count: 1 });
  assert.equal(calls, 3);
  now = sessionLifetimeSeconds * 1000;
  assert.deepEqual(await count(cookie), { count: 0 });
  assert.deepEqual(await ids(cookie), []);
  assert.notEqual((await req({ cookie })).headers.get('set-cookie')!.split(';')[0], cookie);
  assert.equal((await app.request('/api/health')).status, 200);
  store.close();
  const down = await app.request('/api/health');
  assert.equal(down.status, 503);
  assert.equal((await down.json()).code, 'storage_unavailable');
  const failure = await req({ cookie });
  assert.equal(failure.status, 500);
  assert.equal((await failure.json()).code, 'internal_error');
  const missing = await app.request('/api/wrong');
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).code, 'not_found');
});
