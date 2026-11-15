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

test('при HTTP 429 во время обновления видны предупреждение и сохранённая выдача', async ({
  page,
}) => {
  await mockSearch(page);
  await page.addInitScript(() => localStorage.setItem('tv-shows-explorer.language', 'ru'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const field = page.getByRole('searchbox');
  await field.fill('a');
  await field.press('Enter');
  const cached = page.getByRole('heading', { name: 'Медведь' });
  await expect(cached).toBeVisible();
  await field.fill('');
  await expect(cached).toHaveCount(0);
  await page.route(searchRoute, (route) => route.fulfill({ status: 429, body: '' }));
  await page.clock.fastForward(3000);
  await field.fill('a');
  await field.press('Enter');

  await expect(page.locator('[data-kind="warning"]')).toContainText(
    'Слишком много запросов. Подождите немного и попробуйте снова.',
  );
  await expect(cached).toBeVisible();
  const dismiss = page.getByRole('button', { name: 'Закрыть уведомление' });
  await dismiss.click();
  await expect(page.locator('[data-kind="info"]')).toContainText('Показана сохранённая выдача.');
  await dismiss.click();
  await expect(page.locator('[data-kind]')).toHaveCount(0);
});
