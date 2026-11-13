import { expect, test } from '@playwright/test';

import { searchRoute } from './mockSearch';


test('пустой старт, задержка, Enter и запоздалый ответ после смены и очистки', async ({ page }) => {
  const requests: string[] = [];
  let release!: () => void;
  const old = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(searchRoute, async (route) => {
    const q = new URL(route.request().url()).searchParams.get('q')!;
    requests.push(q);
    if (q === 'old') {
      await old;
    }
    await route.fulfill({
      json: [{ show: { id: 1, name: q, genres: [], premiered: null, image: null } }],
    });
  });
  await page.goto('/');
  const intro = page.getByRole('region', { name: 'What to watch?' });
  const field = page.getByRole('searchbox', { name: 'Search TV shows' });
  await expect(field).toBeVisible();
  await page.clock.install();
  const now = new Date();
  await page.clock.pauseAt(now.getTime() + 1000);
  await expect(page.getByRole('button', { name: 'Use dark theme' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Switch to Russian' })).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(0);
  expect(requests).toEqual([]);
  await field.fill('ol');
  await page.clock.runFor(200);
  await field.fill(' old ');
  await page.clock.runFor(299);
  expect(requests).toEqual([]);
  await expect(intro).not.toHaveAttribute('data-docked');
  await expect(page.getByRole('heading', { name: 'Searching for shows…' })).toHaveCount(0);
  await page.clock.runFor(1);
  await expect.poll(() => requests.slice()).toEqual(['old']);
  await field.fill('new');
  await field.press('Enter');
  await expect(page.getByRole('heading', { name: 'new' })).toBeVisible();
  await expect(page.getByText('Year unknown')).toBeVisible();
  await expect(page.getByText('No genre')).toBeVisible();
  await expect(page.getByRole('group')).toHaveCount(0);
  await expect(field).toBeFocused();
  await field.fill('  ');
  await expect(field).toHaveValue('');
  const response = page.waitForResponse((r) => r.url().includes('q=old'));
  release();
  await response;
  await page.clock.runFor(600);
  await expect(page.getByRole('listitem')).toHaveCount(0);
  await expect(intro).not.toHaveAttribute('data-docked');
  expect(requests).toEqual(['old', 'new']);
});
test('ожидание, ошибка, повтор того же запроса и пустой результат', async ({ page }) => {
  const qs: string[] = [];
  await page.route(searchRoute, async (route) => {
    qs.push(new URL(route.request().url()).searchParams.get('q')!);
    if (qs.length === 1) {
      await route.fulfill({ status: 503, body: '' });
    } else {
      await route.fulfill({ json: [] });
    }
  });
  await page.goto('/');
  const intro = page.getByRole('region', { name: 'What to watch?' });
  const field = page.getByRole('searchbox');
  await field.fill('unknown');
  await expect(page.getByText('Searching for shows…')).toBeVisible();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Couldn’t load the results' }),
  ).toBeVisible();
  await expect(page.locator('[data-kind="error"]')).toContainText(
    'Could not load the data. Please try again.',
  );
  await expect(intro).toHaveAttribute('data-docked', '');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByText('No shows found')).toBeVisible();
  await expect(intro).toHaveAttribute('data-docked', '');
  await expect(field).toHaveValue('unknown');
  expect(qs).toEqual(['unknown', 'unknown']);
});
