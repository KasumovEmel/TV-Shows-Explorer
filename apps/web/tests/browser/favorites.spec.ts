import { expect, test } from '@playwright/test';


test('saved snapshot survives reload, failed changes can be retried', async ({ page }) => {
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
  await add.click();
  await expect(card.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Favorites' }).click();
  await expect(page).toHaveURL(/\/favorites$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Night Flight' })).toBeVisible();
  const remove = page.getByRole('button', { name: 'Remove Night Flight' });
  await remove.click();
  await expect(page.getByText('No saved shows yet.')).toBeVisible();
  await page.getByRole('link', { name: 'Search shows' }).click();
  await page.getByRole('searchbox').fill('night');
  await expect(page.getByRole('button', { name: 'Save Night Flight' })).toBeEnabled();
});
