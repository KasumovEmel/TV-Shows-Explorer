import assert from 'node:assert/strict';
import test from 'node:test';

import { addFavorite } from '../src/app/logic/favorites/tasks/addFavorite';
import { listFavorites } from '../src/app/logic/favorites/tasks/listFavorites';
import { removeFavorite } from '../src/app/logic/favorites/tasks/removeFavorite';
import { loadSearchPage } from '../src/app/pages/SearchPage/search/logic/tasks/loadSearchPage';
import { selectGenre } from '../src/app/pages/SearchPage/search/logic/tasks/selectGenre';


void test('search and genre tasks operate on plain criteria', async () => {
  const criteria = selectGenre({ criteria: { q: 'night', page: 3 }, genre: 'Comedy' });
  assert.deepEqual(criteria, { q: 'night', genre: 'Comedy', page: 1 });
  assert.deepEqual(selectGenre({ criteria, genre: '' }), { q: 'night', genre: undefined, page: 1 });
  const signal = new AbortController().signal;
  const result = {
    items: [],
    genres: [],
    page: 1,
    pageSize: 3 as const,
    totalBeforeFilter: 0,
    totalAfterFilter: 0,
  };
  assert.equal(
    await loadSearchPage({
      criteria,
      signal,
      // oxlint-disable-next-line project/object-parameters -- Подставная операция реализует сигнатуру клиента Orval.
      requestPage: async (params, options) => {
        assert.equal(params, criteria);
        assert.equal(options?.signal, signal);

        return result;
      },
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
  await addFavorite({ id: '7', request: async (id) => assert.equal(id, '7') });
  assert.equal(
    await removeFavorite({
      id: '7',
      request: async (id) => {
        assert.equal(id, '7');

        return { items: cards };
      },
    }),
    cards,
  );
  await assert.rejects(addFavorite({ id: '7', request: fail }), /offline/);
  await assert.rejects(removeFavorite({ id: '7', request: fail }), /offline/);
});
