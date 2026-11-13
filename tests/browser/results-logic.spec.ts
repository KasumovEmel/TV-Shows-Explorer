import { expect, test } from '@playwright/test';

import { filterShows } from '../../src/app/SearchPage/Results/logic/tasks/filterShows';
import { paginateShows } from '../../src/app/SearchPage/Results/PagedResults/logic/paginateShows';
import nightShows from './night-shows.json' with { type: 'json' };


const shows = nightShows.map(({ id, en, genres }) => ({
  id: String(id),
  originalTitle: en,
  genres,
}));

test('фильтр сохраняет жанры всей выдачи и исходный порядок сериалов', () => {
  const genres = ['Thriller', 'Drama', 'Mystery', 'Comedy'];
  expect(filterShows(shows, '')).toEqual({ genres, cards: shows });
  expect(filterShows(shows, 'Thriller')).toEqual({ genres, cards: [shows[0], shows[3], shows[5]] });
  expect(filterShows(shows, 'Comedy')).toEqual({ genres, cards: [shows[6]] });
});

test('семь сериалов открываются группами по три с остатком в последней', () => {
  const first = shows.slice(0, 3);
  const second = shows.slice(3, 6);
  const last = [shows[6]];
  expect(paginateShows(shows, 1)).toEqual({ pages: 3, groups: [first], shown: 3 });
  expect(paginateShows(shows, 2)).toEqual({ pages: 3, groups: [first, second], shown: 6 });
  expect(paginateShows(shows, 3)).toEqual({ pages: 3, groups: [first, second, last], shown: 7 });
  expect(paginateShows([], 1)).toEqual({ pages: 0, groups: [], shown: 0 });
});
