import { expect, test } from '@playwright/test';

import { mockSearch } from './mockSearch';


test.beforeEach(async ({ page }) => {
  await mockSearch(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.getByRole('searchbox').fill('night');
  await expect(page.getByRole('listitem')).toHaveCount(3);
});
test('граница раскрывает ровно одну группу, включая высокое окно', async ({ page }) => {
  const cards = page.getByRole('listitem');
  await page.setViewportSize({ width: 1440, height: 2200 });
  await expect(cards).toHaveCount(3);
  await page.mouse.wheel(0, 150);
  await expect(cards).toHaveCount(6);
  await page.mouse.wheel(0, 150);
  await expect(cards).toHaveCount(7);
  await expect(page.getByText('Showing all results')).toBeVisible();
  await page.mouse.wheel(0, 150);
  await expect(cards).toHaveCount(7);
  expect(await cards.locator('h3').allTextContents()).toEqual([
    'Night Flight',
    'Night Radio',
    'Night Shift',
    'Night Train',
    'Night Lights',
    'Night Archive',
    'Night Screening',
  ]);
});
test('клавиатурный переход 1 → 3 → 1 сохраняет группы и отмечает верхнюю', async ({ page }) => {
  const nav = page.getByRole('navigation'),
    last = nav.getByRole('link', { name: 'Page 3' }),
    first = nav.getByRole('link', { name: 'Page 1' });
  await last.focus();
  await last.press('Enter');
  await expect(last).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('list', { name: 'Page 3' })).toBeFocused();
  await expect(page.getByRole('listitem')).toHaveCount(7);
  await first.click();
  await expect(first).toHaveAttribute('aria-current', 'page');
  const top = await nav.boundingBox(),
    group = await page.getByRole('list', { name: 'Page 1' }).boundingBox();
  expect(group!.y).toBeGreaterThanOrEqual(top!.y + top!.height);
  expect(group!.y).toBeLessThan(top!.y + top!.height + 16);
  await page.setViewportSize({ width: 1440, height: 700 });
  await page.mouse.wheel(0, 550);
  await expect(nav.getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  await expect(first).toBeFocused();
  await page.mouse.wheel(0, 1500);
  await expect(last).toHaveAttribute('aria-current', 'page');
});
test('жанр седьмой карточки виден сразу; выбор и сброс начинают новую выдачу', async ({ page }) => {
  const comedy = page.getByRole('button', { name: 'Comedy' });
  await comedy.focus();
  await comedy.press('Space');
  await expect(comedy).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('1 show', { exact: true })).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Night Screening' })).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mystery' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(2);
  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByText('7 shows', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Page 3' }).click();
  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await page.getByRole('button', { name: 'Comedy' }).click();
  await page.getByRole('searchbox').fill('dark');
  await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Dark' })).toBeVisible();
});

test('короткий список: переход ко второй группе сам не раскрывает третью', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1700 });
  const nav = page.getByRole('navigation');
  const second = nav.getByRole('link', { name: 'Page 2' });
  await second.focus();
  await second.press('Enter');
  const group = page.getByRole('list', { name: 'Page 2' });
  await expect(group).toBeFocused();
  await expect(second).toHaveAttribute('aria-current', 'page');
  const top = await nav.boundingBox(),
    cards = await group.boundingBox();
  expect(cards!.y - top!.y - top!.height).toBeLessThan(16);
  expect(cards!.y).toBeGreaterThanOrEqual(top!.y + top!.height);
  await expect(page.getByRole('listitem')).toHaveCount(6);
  await page.keyboard.press('PageDown');
  await expect(page.getByRole('listitem')).toHaveCount(7);
});
