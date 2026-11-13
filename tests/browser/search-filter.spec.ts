import { expect, test } from '@playwright/test';

import { mockSearch, searchRoute } from './mockSearch';


test('жанр сохраняется между поисками, в пустой выдаче и после очистки поля', async ({ page }) => {
  await mockSearch(page);
  await page.route('**/search/shows?q=missing', (route) => route.fulfill({ json: [] }));
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith(searchRoute.split('?')[0])) {
      requests.push(new URL(request.url()).searchParams.get('q')!);
    }
  });
  await page.goto('/');
  const field = page.getByRole('searchbox');
  const drama = page.getByRole('button', { name: 'Drama', exact: true });
  const all = page.getByRole('button', { name: 'All', exact: true });
  await field.fill('a');
  await drama.click();
  await field.fill('night');
  await expect(drama).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('listitem').locator('h3')).toHaveText([
    'Night Flight',
    'Night Shift',
    'Night Lights',
  ]);
  await field.fill('missing');
  await expect(page.getByRole('heading', { name: 'No shows found' })).toBeVisible();
  await expect(drama).toHaveAttribute('aria-pressed', 'true');
  await expect(all).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await field.fill('dark');
  await expect(page.getByRole('heading', { name: 'No shows match this genre' })).toBeVisible();
  await expect(drama).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('listitem')).toHaveCount(0);
  await expect(page.getByRole('navigation')).toHaveCount(0);
  await all.click();
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Dark' })).toBeVisible();
  expect(requests).toEqual(['a', 'night', 'missing', 'dark']);
});
