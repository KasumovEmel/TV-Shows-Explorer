import { expect, test } from '@playwright/test';

import type { ReleaseRequest } from './types';


test('список управляет сердцами и счётчиком после загрузки и удаления', async ({ page }) => {
  const first = { id: '1', originalTitle: 'Night Flight', genres: [] };
  const second = { id: '2', originalTitle: 'Night Radio', genres: [] };
  let releaseList!: ReleaseRequest;
  let releaseCount!: ReleaseRequest;
  const list = new Promise<void>((resolve) => {
    releaseList = resolve;
  });
  const count = new Promise<void>((resolve) => {
    releaseCount = resolve;
  });
  let reads = 0;
  await page.route('**/api/favorites/count', async (route) => {
    await count;
    await route.fulfill({ json: { count: 9 } });
  });
  await page.route('**/api/favorites', async (route) => {
    reads++;
    await list;
    await route.fulfill({ json: { items: [first] } });
  });
  await page.route('**/api/favorites/1', (route) => route.fulfill({ json: { items: [second] } }));
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  const hearts = page.getByRole('button', { name: 'Loading favorites…' });
  await expect(hearts).toHaveCount(3);
  await expect(hearts.first()).toBeDisabled();
  await expect(hearts.first().locator('svg')).toHaveCSS('animation-iteration-count', 'infinite');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(hearts.first().locator('svg')).toHaveCSS('animation-name', 'none');
  expect(reads).toBe(1);

  releaseList();
  const header = page.getByRole('link', { name: 'Favorites (1)' });
  await expect(header).toBeVisible();
  const counted = page.waitForResponse('**/api/favorites/count');
  releaseCount();
  await counted;
  await expect(header).toHaveText('1');
  await header.click();
  await expect.poll(() => reads).toBe(2);
  await page.getByRole('button', { name: 'Remove Night Flight' }).click();
  await expect(page.getByRole('heading', { name: 'Night Radio' })).toBeVisible();
  await page.getByRole('link', { name: 'Search shows' }).click();
  await expect(page.getByRole('button', { name: 'Save Night Flight' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(page.getByRole('button', { name: 'Remove Night Radio' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(reads).toBe(2);
});

test('после ошибки загрузки можно повторить запрос из сердца', async ({ page }) => {
  await page.route('**/api/favorites', (route) => route.fulfill({ status: 500 }), { times: 1 });
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  const retry = page.getByRole('button', { name: 'Retry loading favorites' }).first();
  await expect(retry).toBeEnabled();
  await retry.click();
  await expect(page.getByRole('button', { name: 'Save Night Flight' })).toBeEnabled();
});
