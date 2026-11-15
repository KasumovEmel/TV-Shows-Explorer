import { expect, test } from '@playwright/test';


test('saved snapshot survives reload, failed changes can be retried', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  const listRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/api/favorites') {
      listRequests.push(request.url());
    }
  });
  await page.goto('/');
  const favorites = page.getByRole('link', { name: 'Favorites' });
  await expect(favorites).toHaveText('0');
  expect(listRequests).toHaveLength(0);
  const field = page.getByRole('searchbox');
  await field.fill('night');
  const card = page.getByRole('listitem').first();
  const add = card.getByRole('button', { name: 'Save Night Flight' });
  await page.route(
    '**/api/favorites/1',
    (r) => r.fulfill({ status: 500, json: { code: 'internal_error', message: 'Failed' } }),
    { times: 1 },
  );
  await add.click();
  await expect(page.locator('[data-kind="error"]')).toBeVisible();
  await expect(favorites).toHaveText('0');
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.locator('[data-kind="success"]')).toHaveCount(0);
  await expect(add).toHaveAttribute('aria-pressed', 'false');
  await expect(add.locator('svg')).toHaveCSS('fill', 'none');
  await add.click();
  await expect(card.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await expect(card.getByRole('button').locator('svg')).toHaveCSS('fill', 'rgb(199, 40, 66)');
  await expect(
    page.getByRole('status').getByText('Added Night Flight to favorites.'),
  ).toBeVisible();
  await expect(favorites).toHaveAccessibleName('Favorites (1)');
  await expect(favorites).toHaveText('1');
  await favorites.click();
  await expect(page).toHaveURL(/\/favorites$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Favorites (1)' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Night Flight' })).toBeVisible();
  const remove = page.getByRole('button', { name: 'Remove Night Flight' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(remove.locator('svg')).toHaveCSS('fill', 'rgb(255, 99, 122)');
  await remove.click();
  await expect(page.getByText('Removed Night Flight from favorites.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Favorites (0)' })).toBeVisible();
  await expect(page.getByText('No saved shows yet.')).toBeVisible();
  await page.getByRole('link', { name: 'Search shows' }).click();
  await expect(favorites).toHaveText('0');
  await page.getByRole('searchbox').fill('night');
  await expect(add).toBeEnabled();
  await expect(add.locator('svg')).toHaveCSS('fill', 'none');
});

test('два сохранения и удаление в поиске обновляют счётчик и стопку Toast', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tv-shows-explorer.language', 'ru'));
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  await page.getByRole('button', { name: 'Сохранить «Night Flight»' }).click();
  await page.getByRole('button', { name: 'Сохранить «Night Radio»' }).click();
  const favorites = page.getByRole('link', { name: 'Избранное' });
  await expect(favorites).toHaveText('2');
  const message = page.locator('[data-kind="success"] [data-depth="0"] p');
  await expect(message).toHaveText('«Night Radio» добавлен в избранное.');
  await page.getByRole('button', { name: 'Закрыть уведомление' }).click();
  await expect(message).toHaveText('«Night Flight» добавлен в избранное.');
  await page.getByRole('button', { name: 'Удалить «Night Flight»' }).click();
  await expect(page.getByText('«Night Flight» удалён из избранного.')).toBeVisible();
  await expect(favorites).toHaveText('1');
  await page.reload();
  await expect(favorites).toHaveText('1');
});

test('знак и название Season One возвращают к текущему поиску', async ({ page }) => {
  await page.goto('/');
  const field = page.getByRole('searchbox');
  await field.fill('night');
  const favorites = page.getByRole('link', { name: 'Favorites' });
  const brand = page.getByRole('link', { name: 'Season One' });
  await expect(favorites).toHaveAttribute('href', '/favorites');
  await expect(brand).toHaveAttribute('href', '/');
  await favorites.press('Enter');
  await expect(page).toHaveURL(/\/favorites$/);
  await brand.locator('svg').click();
  await expect(field).toHaveValue('night');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Favorites' })).toBeVisible();
  await page.getByRole('banner').getByText('Season One', { exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(field).toHaveValue('night');
});
