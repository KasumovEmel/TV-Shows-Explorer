import type { Page, Route } from '@playwright/test';

import { expect, test } from './authenticatedTest';


async function queueTwoShows(page: Page) {
  const ids: string[] = [];
  let first!: Route;
  await page.route(/\/api\/favorites\/\d+$/, async (route) => {
    ids.push(new URL(route.request().url()).pathname.split('/').at(-1)!);
    if (ids.length === 1) {
      first = route;

      return;
    }
    await route.continue();
  });
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  await page.getByRole('button', { name: 'Save Night Flight' }).click();
  await expect.poll(() => ids).toEqual(['1']);
  const second = page.getByRole('button', { name: 'Save Night Radio' });
  await second.click();
  await expect(second).toBeDisabled();
  expect(ids).toEqual(['1']);

  return { first, ids };
}

test('вторая запись ждёт первую и выполняется после её ошибки', async ({ page }) => {
  const { first, ids } = await queueTwoShows(page);
  await first.fulfill({ status: 500 });
  await expect(page.getByRole('button', { name: 'Remove Night Radio' })).toBeEnabled();
  await expect(page.getByRole('link', { name: 'Favorites (1)' })).toBeVisible();
  expect(ids).toEqual(['1', '2']);
  await page.getByRole('button', { name: 'Save Night Flight' }).click();
  await expect(page.getByRole('link', { name: 'Favorites (2)' })).toBeVisible();
  expect(ids).toEqual(['1', '2', '1']);
});

test('выход отменяет активную запись и пропускает ожидающую, новый аккаунт может сохранить тот же сериал', async ({
  page,
}) => {
  const { first, ids } = await queueTwoShows(page);
  const aborted = page.waitForEvent('requestfailed', (request) => request === first.request());
  await page.getByRole('button', { name: 'More options' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await aborted;
  await first.fulfill({ status: 204 });
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('favorite-queue@example.test');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('link', { name: 'Favorites (0)' })).toBeVisible();
  expect(ids).toEqual(['1']);
  await expect(page.locator('[data-kind]')).toHaveCount(0);
  await page.getByRole('searchbox').fill('night');
  await page.getByRole('button', { name: 'Save Night Radio' }).click();
  await expect(page.getByRole('link', { name: 'Favorites (1)' })).toBeVisible();
  expect(ids).toEqual(['1', '2']);
});
