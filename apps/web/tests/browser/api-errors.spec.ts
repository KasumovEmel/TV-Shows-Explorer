import { expect, test } from '@playwright/test';

import { mockSearch, searchRoute } from './mockSearch';


test('при сбое сети без HTTP-ответа появляется общее уведомление', async ({ page }) => {
  await page.route(searchRoute, (route) => route.abort('connectionfailed'));
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  await expect(page.locator('[data-kind="error"]')).toContainText(
    'Could not load the data. Please try again.',
  );
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});

test('повторный поиск запрашивает API и при HTTP 429 показывает предупреждение', async ({
  page,
}) => {
  await mockSearch(page);
  await page.addInitScript(() => localStorage.setItem('tv-shows-explorer.language', 'ru'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const field = page.getByRole('searchbox');
  await field.fill('a');
  await field.press('Enter');
  const heading = page.getByRole('heading', { name: 'Медведь' });
  await expect(heading).toBeVisible();
  await field.fill('');
  await expect(heading).toHaveCount(0);
  await page.route(searchRoute, (route) => route.fulfill({ status: 429, body: '' }));
  await field.fill('a');
  await field.press('Enter');

  const warning = page.locator('[data-kind="warning"]');
  await expect(warning).toContainText(
    'Слишком много запросов. Подождите немного и попробуйте снова.',
  );
  await expect(heading).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Повторить' })).toBeVisible();
  await expect(page.locator('[data-kind="info"]')).toHaveCount(0);
  await warning.getByRole('button').click();
  await expect(page.locator('[data-kind]')).toHaveCount(0);
});
