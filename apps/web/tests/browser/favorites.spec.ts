import { expect, test } from '@playwright/test';


test('saved snapshot survives reload, failed changes can be retried', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
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
  await expect(add).toHaveAttribute('aria-pressed', 'false');
  await expect(add.locator('svg')).toHaveCSS('fill', 'none');
  await add.click();
  await expect(card.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await expect(card.getByRole('button').locator('svg')).toHaveCSS('fill', 'rgb(199, 40, 66)');
  await page.getByRole('link', { name: 'Favorites' }).click();
  await expect(page).toHaveURL(/\/favorites$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Night Flight' })).toBeVisible();
  const remove = page.getByRole('button', { name: 'Remove Night Flight' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(remove.locator('svg')).toHaveCSS('fill', 'rgb(255, 99, 122)');
  await remove.click();
  await expect(page.getByText('No saved shows yet.')).toBeVisible();
  await page.getByRole('link', { name: 'Search shows' }).click();
  await page.getByRole('searchbox').fill('night');
  await expect(add).toBeEnabled();
  await expect(add.locator('svg')).toHaveCSS('fill', 'none');
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
