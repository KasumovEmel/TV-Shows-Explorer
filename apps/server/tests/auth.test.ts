import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from '../src/app';
import { ShowCatalog } from '../src/catalog';
import { FavoritesStore } from '../src/favorites';
import { requestLogin } from './requestLogin';


void test('login normalizes email, restores the user and revokes only the current session', async () => {
  const app = createApp({ catalog: new ShowCatalog(), favorites: new FavoritesStore() });

  const session = async (cookie = '') =>
    (await app.request('/api/auth/session', { headers: { cookie } })).json();

  assert.deepEqual(await session(), { email: null });
  for (const email of [undefined, '', '   ', 'invalid']) {
    const failure = await requestLogin({ app, email });
    assert.equal(failure.status, 400);
    assert.equal(failure.headers.get('set-cookie'), null);
  }
  const email = 'reader@example.test';
  const first = await requestLogin({ app, email: '  Reader@Example.TEST ' });
  assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), { email });
  const cookie = first.headers.get('set-cookie')!.split(';')[0];
  const second = (await requestLogin({ app, email })).headers.get('set-cookie')!.split(';')[0];
  assert.deepEqual(await session(cookie), { email });
  for (let i = 0; i < 2; i++) {
    const response = await app.request('/api/auth/logout', { method: 'POST', headers: { cookie } });
    assert.equal(response.status, 204);
    assert.match(response.headers.get('set-cookie')!, /Max-Age=0/);
    assert.deepEqual(await session(cookie), { email: null });
  }
  assert.deepEqual(await session(second), { email });
});
