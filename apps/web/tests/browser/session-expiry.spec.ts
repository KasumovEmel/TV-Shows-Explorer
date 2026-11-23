import type { Route } from '@playwright/test';

import { expect, test } from './authenticatedTest';


test('истёкшая сессия скрывает отметки, поиск остаётся доступен', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  const add = page.getByRole('button', { name: 'Save Night Flight' });
  await expect(add).toBeEnabled();
  expect((await page.request.post('/api/auth/logout')).status()).toBe(204);
  await add.click();
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  await expect(add).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Night Flight' })).toBeVisible();
});

test('поздний ответ списка после выхода не попадает в другой аккаунт', async ({ page }) => {
  let held!: Route;
  await page.route(
    '**/api/favorites',
    (route) => {
      held = route;
    },
    { times: 1 },
  );
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  await expect.poll(() => !!held).toBe(true);
  await page.getByRole('button', { name: 'More options' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('empty-list@example.test');
  await page.getByRole('button', { name: 'Sign in' }).click();
  const empty = page.getByRole('link', { name: 'Favorites (0)' });
  await expect(empty).toBeVisible();
  await held.fulfill({ json: { items: [{ id: '1', originalTitle: 'Night Flight', genres: [] }] } });
  await expect(empty).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save Night Flight' })).toBeEnabled();
});
