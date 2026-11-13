import { expect, test } from '@playwright/test';

import { mockSearch } from './mockSearch';


test('язык и тема доступны до поиска, сохраняются и не сбрасывают выдачу', async ({ page }) => {
  await mockSearch(page);
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');
  await page.getByRole('button', { name: 'Use dark theme' }).press('Space');
  await expect(html).toHaveCSS('color-scheme', 'dark');
  await page.getByRole('button', { name: 'Switch to Russian' }).press('Enter');
  await expect(page.getByRole('searchbox', { name: 'Поиск сериалов' })).toHaveValue('');
  await page.reload();
  await expect(html).toHaveCSS('color-scheme', 'dark');
  await expect(html).toHaveAttribute('lang', 'ru');
  await page.getByRole('searchbox').fill('ноч');
  const all = page.getByRole('button', { name: 'Все', exact: true });
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  const second = page.getByRole('link', { name: 'Страница 2' });
  await second.click();
  await page.getByRole('button', { name: 'Включить светлую тему' }).press('Enter');
  await expect(html).toHaveCSS('color-scheme', 'light');
  await expect(page.getByRole('searchbox')).toHaveValue('ноч');
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('listitem')).toHaveCount(6);
  await page.getByRole('button', { name: 'Переключить на английский' }).click();
  await expect(html).toHaveAttribute('lang', 'en');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(html).toHaveCSS('color-scheme', 'light');
});
