import { expect, test } from '@playwright/test';

import { mockSearch } from './mockSearch';


test('заголовок шапки помещается в одну строку на обоих языках', async ({ page }) => {
  await page.goto('/');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.reload();
  for (const title of ['What to watch?', 'Что смотрим?']) {
    await expect(heading).toHaveText(title);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 390, 767, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const fits = await heading.evaluate((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);

        return range.getClientRects().length === 1 && el.scrollWidth <= el.clientWidth;
      });
      expect(fits, title + ' / ' + width + ' px').toBe(true);
    }
    if (title === 'What to watch?') {
      await page.getByRole('button', { name: 'Switch to Russian' }).click();
    }
  }
});

for (const colorScheme of ['light', 'dark'] as const) {
  test('подсветка и подсказки кнопок шапки, тема ' + colorScheme, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    const themeName = colorScheme === 'light' ? 'Use dark theme' : 'Use light theme';
    const theme = page.getByRole('button', { name: themeName });
    const language = page.getByRole('button', { name: 'Switch to Russian' });
    await expect(theme).toHaveAttribute('title', themeName);
    await expect(language).toHaveAttribute('title', 'Switch to Russian');
    const background = 'rgba(0, 0, 0, 0)';
    await expect(theme).toHaveCSS('background-color', background);
    await expect(language).toHaveCSS('background-color', background);
    await theme.hover();
    await expect(theme).toHaveCSS('background-color', /[,/]\s*0\.\d+\)$/);
    const hovered = await theme.evaluate((el) => getComputedStyle(el).backgroundColor);
    await language.hover();
    await expect(language).toHaveCSS('background-color', hovered);
    await expect(theme).toHaveCSS('background-color', background);
    await page.mouse.move(0, 0);
    await expect(language).toHaveCSS('background-color', background);
    for (const button of [theme, language]) {
      await page.keyboard.press('Tab');
      await expect(button).toBeFocused();
      await expect(button).toHaveCSS('outline-style', 'solid');
    }
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Переключить на английский' })).toHaveAttribute(
      'title',
      'Переключить на английский',
    );
  });
}

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
