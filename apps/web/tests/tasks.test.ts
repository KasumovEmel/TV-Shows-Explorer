import assert from 'node:assert/strict';
import test from 'node:test';

import { addFavorite } from '../src/app/favorites/logic/tasks/addFavorite';
import { listFavorites } from '../src/app/favorites/logic/tasks/listFavorites';
import { removeFavorite } from '../src/app/favorites/logic/tasks/removeFavorite';
import { selectGenre } from '../src/app/SearchPage/logic/tasks/selectGenre';
import { searchShows } from '../src/app/SearchPage/Results/logic/tasks/searchShows';


void test('search and genre tasks operate on plain criteria', async () => {
  const criteria = selectGenre({ q: 'night', page: 3 }, 'Comedy');
  assert.deepEqual(criteria, { q: 'night', genre: 'Comedy', page: 1 });
  assert.deepEqual(selectGenre(criteria, ''), { q: 'night', genre: undefined, page: 1 });
  const signal = new AbortController().signal;
  const result = {
    items: [],
    genres: [],
    page: 1,
    pageSize: 3,
    totalBeforeFilter: 0,
    totalAfterFilter: 0,
  };
  assert.equal(
    await searchShows(criteria, signal, async (params, s) => {
      assert.equal(params, criteria);
      assert.equal(s, signal);

      return result;
    }),
    result,
  );
});
void test('favorites tasks read, write and propagate failures', async () => {
  const cards = [{ id: '7', originalTitle: 'Night', genres: ['Drama'] }];
  assert.equal(await listFavorites(async () => ({ items: cards })), cards);

  const fail = async () => {
    throw new Error('offline');
  };

  await assert.rejects(listFavorites(fail), /offline/);
  for (const op of [addFavorite, removeFavorite]) {
    await op('7', async (id) => {
      assert.equal(id, '7');
    });
    await assert.rejects(op('7', fail), /offline/);
  }
});
