import type { Route } from '@playwright/test';

import { expect, test } from './authenticatedTest';
import { respond, searchRoute } from './mockSearch';


test('очистка поиска позволяет завершить начатое сохранение в избранное', async ({ page }) => {
  let save!: Route;
  await page.route('**/api/favorites/1', (route) => {
    save = route;
  });
  await page.goto('/');
  const field = page.getByRole('searchbox');
  await field.fill('night');
  await page.getByRole('button', { name: 'Save Night Flight' }).click();
  await expect.poll(() => !!save).toBe(true);
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(field).toHaveValue('');
  await save.continue();
  await expect(page.getByRole('link', { name: 'Favorites (1)' })).toBeVisible();
});

test('повтор Enter и выход из аккаунта сохраняют активный запрос поиска', async ({ page }) => {
  const searches: Route[] = [];
  await page.route(searchRoute, (route) => {
    searches.push(route);
  });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Favorites (0)' })).toBeVisible();
  const field = page.getByRole('searchbox');
  await field.fill('night');
  await field.press('Enter');
  await expect.poll(() => searches.length).toBe(1);
  await field.press('Enter');
  await page.getByRole('button', { name: 'More options' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  await respond({
    route: searches[0],
    items: [{ id: '1', originalTitle: 'Night Flight', genres: [] }],
  });
  await expect(page.getByRole('heading', { name: 'Night Flight' })).toBeVisible();
  expect(searches).toHaveLength(1);
});
