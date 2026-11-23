import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../src/app';
import { ShowCatalog, TvMazeClient } from '../src/catalog';
import { FavoritesStore } from '../src/favorites';
import { requestLogin } from './requestLogin';


void test('guest cannot read or change favorites, health reports storage readiness', async () => {
  const catalog = new ShowCatalog();
  const app = createApp({ catalog, favorites: new FavoritesStore() });
  for (const input of [
    {},
    { path: '/count' },
    { path: '/1', method: 'PUT' },
    { path: '/1', method: 'DELETE' },
  ]) {
    const response = await app.request('/api/favorites' + (input.path ?? ''), {
      method: input.method ?? 'GET',
    });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('set-cookie'), null);
  }
  assert.equal((await app.request('/api/health')).status, 200);
  const unavailable = createApp({
    catalog,
    favorites: new FavoritesStore({ storage: Object.freeze({}) }),
  });
  const down = await unavailable.request('/api/health');
  assert.equal(down.status, 503);
  assert.equal((await down.json()).code, 'storage_unavailable');
  const missing = await app.request('/api/wrong');
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).code, 'not_found');
});

void test('выход во время загрузки снимка отменяет его сохранение', async () => {
  const started = Promise.withResolvers<void>();
  const snapshot = Promise.withResolvers<Response>();
  const catalog = new ShowCatalog({
    api: new TvMazeClient({
      transport: () => {
        started.resolve();

        return snapshot.promise;
      },
    }),
  });
  const app = createApp({ catalog, favorites: new FavoritesStore() });
  const email = 'pending@example.test';
  const first = await requestLogin({ app, email });
  const headers = { cookie: first.headers.get('set-cookie')!.split(';')[0] };
  const saving = app.request('/api/favorites/1', { headers, method: 'PUT' });
  await started.promise;
  await app.request('/api/auth/logout', { headers, method: 'POST' });
  snapshot.resolve(Response.json({ id: 1, name: 'Night Flight', genres: [] }));
  assert.equal((await saving).status, 401);
  const next = await requestLogin({ app, email });
  const response = await app.request('/api/favorites', {
    headers: { cookie: next.headers.get('set-cookie')!.split(';')[0] },
  });
  assert.deepEqual(await response.json(), { items: [] });
});
