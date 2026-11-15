import { expect, test } from '@playwright/test';

import { mockSearch, searchRoute } from './mockSearch';


test('page three can be retried without losing page two or keyboard focus target', async ({
  page,
}) => {
  await mockSearch(page);
  let attempts = 0;
  await page.route(searchRoute, async (r) => {
    if (new URL(r.request().url()).searchParams.get('page') === '3' && ++attempts === 1) {
      await r.fulfill({
        status: 502,
        json: { code: 'catalog_unavailable', message: 'Unavailable' },
      });
    } else {
      await r.fallback();
    }
  });
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  await page.getByRole('link', { name: 'Page 3' }).press('Enter');
  await expect(page.getByRole('listitem')).toHaveCount(6);
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(7);
  await expect(page.getByRole('list', { name: 'Page 3' })).toBeFocused();
  expect(attempts).toBe(2);
});
