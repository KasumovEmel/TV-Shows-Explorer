import { expect, test } from '@playwright/test';

import { mockSearch } from './mockSearch';


test('жанр сохраняется между поисками, в пустой выдаче и после очистки поля', async ({ page }) => {
  await mockSearch(page);

  const requests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/shows') {
      requests.push(new URL(request.url()).searchParams.get('q')!);
    }
  });
  await page.goto('/');
  const field = page.getByRole('searchbox');
  const drama = page.getByRole('button', { name: 'Drama', exact: true });
  const all = page.getByRole('button', { name: 'All', exact: true });
  await field.fill('a');
  await Promise.all([
    page.waitForResponse((r) => new URL(r.url()).searchParams.get('genre') === 'Drama'),
    drama.click(),
  ]);
  await field.fill('night');
  await expect(drama).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('listitem').locator('h3')).toHaveText([
    'Night Flight',
    'Night Shift',
    'Night Lights',
  ]);
  await field.fill('missing');
  await expect(page.getByRole('heading', { name: 'No shows match this genre' })).toBeVisible();
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
  expect(requests).toEqual(['a', 'a', 'night', 'missing', 'dark', 'dark']);
});
