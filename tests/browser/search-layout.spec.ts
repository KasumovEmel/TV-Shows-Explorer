import { expect, test } from '@playwright/test';

import { mockSearch, searchRoute } from './mockSearch';


for (const width of [1440, 390]) {
  test('макет поиска: ' + width + ' px', async ({ page }, info) => {
    await mockSearch(page);
    const wide = width === 1440;
    await page.setViewportSize({ width, height: wide ? 1000 : 844 });
    await page.addInitScript(() => localStorage.setItem('tv-shows-explorer.language', 'ru'));
    await page.goto('/');
    const field = page.getByRole('searchbox', { name: 'Поиск сериалов' });
    await page.keyboard.press('Tab');
    await expect(field).toBeFocused();
    const form = page.getByRole('search');
    const initial = await form.boundingBox();
    expect(initial!.width).toBe(wide ? 640 : 350);
    await field.fill('ноч');
    await expect(page.getByRole('listitem')).toHaveCount(3);
    await page.evaluate(() => document.fonts.ready);
    const same = await field.evaluate((el) => el === document.activeElement);
    expect(same).toBe(true);
    const posters = page.locator('li img');
    const first = await posters.nth(0).boundingBox(),
      second = await posters.nth(1).boundingBox();
    expect(first!.x).toBe(wide ? 72 : 20);
    expect(first!.width).toBe(wide ? 416 : 104);
    expect(Math.abs(first!.y - (wide ? 454 : 470))).toBeLessThan(8);
    expect(wide ? second!.x - first!.x : second!.y - first!.y).toBeCloseTo(wide ? 440 : 104, 0);
    await expect(form).toHaveCSS('height', wide ? '62px' : '52px');
    await expect(page.getByRole('button', { name: 'Очистить поиск' })).toHaveCSS(
      'min-width',
      '44px',
    );
    await page.screenshot({ path: info.outputPath('results.png') });
    const last = page.getByRole('link', { name: 'Страница 3' });
    await last.focus();
    await last.press('Enter');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.getByRole('list', { name: 'Страница 3' })).toBeFocused();
    await expect(last).toHaveAttribute('aria-current', 'page');
  });
}
test('320 px: длинные слова, отсутствующие метаданные, битый постер и много страниц', async ({
  page,
}) => {
  const title = 'VeryLongUnbrokenTitle'.repeat(5),
    genre = 'longGenre'.repeat(8);
  await page.setViewportSize({ width: 320, height: 720 });
  await page.route(searchRoute, (route) =>
    route.fulfill({
      json: Array.from({ length: 28 }, (_, i) => ({
        show: {
          id: i,
          name: title,
          premiered: null,
          genres: i ? [] : ['', genre, genre],
          image: { medium: '/missing-poster.png', original: '/missing-poster.png' },
        },
      })),
    }),
  );
  await page.goto('/');
  await page.getByRole('searchbox').fill('long');
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByRole('button', { name: genre })).toHaveCount(1);
  await expect(page.getByText('Year unknown')).toHaveCount(3);
  await expect(page.getByRole('listitem').first().locator('img')).toHaveCount(0);
  await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(3);
  const last = page.getByRole('link', { name: 'Page 10', exact: true });
  await last.focus();
  await last.press('Enter');
  await expect(page.getByRole('list', { name: 'Page 10', exact: true })).toBeFocused();
  await expect(last).toHaveAttribute('aria-current', 'page');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
