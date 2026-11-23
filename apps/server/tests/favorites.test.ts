import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../src/app';
import { ShowCatalog, TvMazeClient } from '../src/catalog';
import { FavoritesStore, sessionLifetimeSeconds } from '../src/favorites';
import { requestLogin } from './requestLogin';
import type { FavoriteRequest, ShowId } from './types';


void test('personal lists, snapshots, fixed expiry and idempotent mutations', async () => {
  let now = 0,
    calls = 0,
    isOffline = false;
  const catalog = new ShowCatalog({
    api: new TvMazeClient({
      transport: async (url) => {
        calls++;
        if (isOffline) {
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
  const store = new FavoritesStore({ now: () => now });
  const app = createApp({ catalog, favorites: store, isCookieSecure: true });

  const req = ({ cookie = '', path = '', method = 'GET' }: FavoriteRequest = {}) =>
    app.request('/api/favorites' + path, { method, headers: { cookie } });

  const count = async (c = '') => {
    const response = await req({ cookie: c, path: '/count' });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('set-cookie'), null);

    return response.json();
  };

  const email = 'reader@example.test';
  const first = await requestLogin({ app, email });
  const other = await requestLogin({ app, email: 'another@example.test' });
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
  const restarted = createApp({
    catalog: new ShowCatalog(),
    favorites: new FavoritesStore({ now: () => now }),
  });
  const headers = { cookie };
  const resetCount = await restarted.request('/api/favorites/count', { headers });
  assert.equal(resetCount.status, 401);
  assert.equal(resetCount.headers.get('set-cookie'), null);
  const resetList = await restarted.request('/api/favorites', { headers });
  assert.equal(resetList.status, 401);
  const fresh = (await requestLogin({ app: restarted, email })).headers
    .get('set-cookie')!
    .split(';')[0];
  assert.deepEqual(
    await (await restarted.request('/api/favorites', { headers: { cookie: fresh } })).json(),
    { items: [] },
  );
  now += 29 * 86400_000;
  isOffline = true;
  assert.deepEqual(await ids(cookie), ['2', '1']);
  assert.equal((await put()).status, 204);
  assert.equal((await req({ cookie })).headers.get('set-cookie'), null);
  for (let i = 0; i < 2; i++) {
    const removed = await req({ cookie, path: '/2', method: 'DELETE' });
    assert.equal(removed.status, 200);
    assert.deepEqual(await removed.json(), await (await req({ cookie })).json());
  }
  assert.deepEqual(await ids(cookie), ['1']);
  assert.deepEqual(await count(cookie), { count: 1 });
  assert.equal(calls, 3);
  now = sessionLifetimeSeconds * 1000;
  assert.equal((await req({ cookie })).status, 401);
  const again = (await requestLogin({ app, email })).headers.get('set-cookie')!.split(';')[0];
  assert.deepEqual(await ids(again), ['1']);
  await app.request('/api/auth/logout', { method: 'POST', headers: { cookie: again } });
  const returned = (await requestLogin({ app, email })).headers.get('set-cookie')!.split(';')[0];
  assert.deepEqual(await ids(returned), ['1']);
});
