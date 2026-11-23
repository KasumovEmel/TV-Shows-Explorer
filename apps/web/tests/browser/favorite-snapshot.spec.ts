import { expect, test } from './authenticatedTest';
import { mockSearch } from './mockSearch';
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
  await page.getByRole('link', { name: 'Season One' }).click();
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

test('избранное загружается один раз за посещение выдачи', async ({ page }) => {
  await mockSearch(page);
  const saved = { id: '4', originalTitle: 'Night Train', genres: ['Thriller'] };
  let reads = 0;
  await page.route('**/api/favorites/count', (route) => route.fulfill({ json: { count: 1 } }));
  await page.route('**/api/favorites', (route) => {
    reads++;

    return route.fulfill({ json: { items: [saved] } });
  });
  await page.goto('/');
  const field = page.getByRole('searchbox');
  await expect(page.getByRole('link', { name: 'Favorites (1)' })).toBeVisible();
  expect(reads).toBe(0);

  await field.fill('missing');
  await expect(page.getByRole('heading', { name: 'No shows found' })).toBeVisible();
  await expect.poll(() => reads).toBe(1);
  await field.fill('night');
  await page.getByRole('link', { name: 'Page 2' }).click();
  const remove = page.getByRole('button', { name: 'Remove Night Train' });
  await expect(remove).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Thriller', exact: true }).click();
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(remove).toHaveAttribute('aria-pressed', 'true');
  expect(reads).toBe(1);

  await page.getByRole('button', { name: 'Clear search' }).click();
  await field.fill('night');
  await expect(remove).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => reads).toBe(2);
});
