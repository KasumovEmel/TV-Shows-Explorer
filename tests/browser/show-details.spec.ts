import { expect, test } from '@playwright/test';

import { mockSearch, searchRoute } from './mockSearch';


test('данные сериала остаются привязаны к карточке при фильтрации и смене языка', async ({
  page,
}) => {
  await mockSearch(page);
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  await page.getByRole('button', { name: 'Thriller' }).click();
  const card = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('heading', { name: 'Night Flight' }) });
  await expect(card.getByText('Premiered: 2024')).toBeVisible();
  await expect(card.getByRole('img', { name: 'Rating: 8.4/10' })).toHaveText('★ 8.4');
  await expect(card.getByText('Genres: Thriller, Drama')).toBeVisible();
  await expect(card.getByText('A night pilot & a dispatcher', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to Russian' }).click();
  await expect(card.getByRole('img', { name: 'Рейтинг: 8,4/10' })).toHaveText('★ 8,4');
  await expect(card.getByText('Жанры: Триллер, Драма')).toBeVisible();
});

test('описание сокращается по словам, а пропуски не подменяются вымышленными данными', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  const show = { id: 1, name: 'Signal', premiered: null, genres: [], image: null };
  const first = 'One signal. Another signal.';
  await page.route(searchRoute, (route) =>
    route.fulfill({
      json: [
        {
          show: {
            ...show,
            summary: '<p>One <b>signal.</b></p><p>Another signal. ' + 'again '.repeat(55) + '</p>',
            rating: { average: 0 },
          },
        },
        {
          show: {
            ...show,
            id: 2,
            name: 'Quiet',
            summary: '<p>&nbsp;</p>',
            rating: { average: null },
          },
        },
      ],
    }),
  );
  await page.goto('/');
  await page.getByRole('searchbox').fill('test');
  const cards = page.getByRole('listitem');
  const summary = cards.first().getByText(first, { exact: false });
  await expect(summary).toHaveText(/^One signal\. Another signal\.( again)+…$/);
  expect((await summary.textContent())!.length).toBeLessThanOrEqual(160);
  await expect(cards.first().getByRole('img', { name: 'Rating: 0/10' })).toHaveText('★ 0');
  await expect(cards.last().getByRole('img', { name: 'Not yet rated' })).toHaveText('★ -');
  await expect(cards.last().getByText('No synopsis available.')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
