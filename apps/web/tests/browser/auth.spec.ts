import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

import type { EmailLogin } from './types';


async function enterEmail({ page, email }: EmailLogin) {
  await page.getByRole('link', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(
    page.getByRole('banner').getByText(email.toLowerCase(), { exact: true }),
  ).toBeVisible();
}

test('гость ищет без запросов избранного, входит с клавиатуры и выходит', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/api/favorites')) {
      requests.push(r.url());
    }
  });
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  await expect(page.getByRole('heading', { name: 'Night Flight' })).toBeVisible();
  await expect(page.getByRole('listitem').first().getByRole('button')).toHaveCount(0);
  await page.goto('/favorites');
  await expect(page).toHaveURL(/\/login$/);
  expect(requests).toEqual([]);
  await page.getByRole('button', { name: 'More options' }).click();
  await page.getByRole('button', { name: 'Switch to Russian' }).click();
  const email = randomUUID() + '@example.test';
  const field = page.getByRole('textbox', { name: 'Электронная почта' });
  await field.fill('invalid');
  await field.press('Enter');
  await expect(page).toHaveURL(/\/login$/);
  await field.fill(email);
  await field.press('Enter');
  await expect(page).toHaveURL(/\/$/);
  await page.reload();
  await expect(page.getByRole('banner').getByText(email)).toBeVisible();
  await page.getByRole('link', { name: 'Избранное' }).click();
  await expect(page.getByRole('heading', { name: 'Избранное (0)' })).toBeVisible();
  await page.getByRole('button', { name: 'Ещё' }).click();
  await page.getByRole('button', { name: 'Выйти' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Войти' })).toBeVisible();
  await expect(page.getByText(email)).toHaveCount(0);
  expect((await page.request.get('/api/favorites')).status()).toBe(401);
});

test('избранное общее для одного email в двух профилях и раздельное для разных адресов', async ({
  page,
  browser,
}) => {
  const email = randomUUID() + '@example.test';
  const otherEmail = randomUUID() + '@example.test';
  const other = await browser.newPage({ baseURL: test.info().project.use.baseURL });
  await page.goto('/');
  await enterEmail({ page, email });
  await page.getByRole('searchbox').fill('night');
  await page.getByRole('button', { name: 'Save Night Flight' }).click();
  await expect(page.getByRole('link', { name: 'Favorites (1)' })).toBeVisible();
  await other.goto('/');
  await enterEmail({ page: other, email: email.toUpperCase() });
  await other.getByRole('link', { name: 'Favorites (1)' }).click();
  await expect(other.getByRole('heading', { name: 'Night Flight' })).toBeVisible();
  await other.getByRole('button', { name: 'More options' }).click();
  await other.getByRole('button', { name: 'Sign out' }).click();
  await enterEmail({ page: other, email: otherEmail });
  await expect(other.getByRole('link', { name: 'Favorites (0)' })).toBeVisible();
  await other.getByRole('searchbox').fill('night');
  await other.getByRole('button', { name: 'Save Night Flight' }).click();
  await other.getByRole('button', { name: 'Remove Night Flight' }).click();
  await expect(other.getByRole('link', { name: 'Favorites (0)' })).toBeVisible();
  await other.getByRole('button', { name: 'More options' }).click();
  await other.getByRole('button', { name: 'Sign out' }).click();
  await enterEmail({ page: other, email });
  await other.getByRole('link', { name: 'Favorites (1)' }).click();
  await expect(other.getByRole('heading', { name: 'Night Flight' })).toBeVisible();
  await other.close();
});
