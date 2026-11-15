import { expect, test } from '@playwright/test';


test('системная тема сохранена до React и следует за устройством во время загрузки', async ({
  page,
}) => {
  await page.route(/\.js$/, (route) => route.abort());
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const loader = page.getByRole('progressbar', { name: 'Season One' });
  await expect(loader).toHaveCSS('background-color', 'rgb(32, 29, 35)');
  expect(await page.evaluate(() => localStorage.getItem('tv-shows-explorer.theme'))).toBe('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(loader).toHaveCSS('background-color', 'rgb(248, 245, 239)');
});

test('три режима имеют разные значки, сохраняются и позволяют вернуться к теме устройства', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const html = page.locator('html');
  const icons = new Set<string | null>();
  for (const [mode, name] of [
    ['system', 'System theme. Use dark theme'],
    ['dark', 'Dark theme. Use light theme'],
    ['light', 'Light theme. Use system theme'],
  ]) {
    await page.reload();
    const button = page.getByRole('button', { name, exact: true });
    await expect(button).toHaveAttribute('title', name);
    expect(await page.evaluate(() => localStorage.getItem('tv-shows-explorer.theme'))).toBe(mode);
    await expect(html).toHaveAttribute('data-theme', mode);
    icons.add(await button.locator('svg path').getAttribute('d'));
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(html).toHaveCSS(
      'background-color',
      mode === 'light' ? 'rgb(248, 245, 239)' : 'rgb(32, 29, 35)',
    );
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(html).toHaveCSS(
      'background-color',
      mode === 'dark' ? 'rgb(32, 29, 35)' : 'rgb(248, 245, 239)',
    );
    await button.click();
  }
  expect(icons.size).toBe(3);
  await expect(html).toHaveAttribute('data-theme', 'system');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(html).toHaveCSS('background-color', 'rgb(32, 29, 35)');
  expect(await page.evaluate(() => localStorage.getItem('tv-shows-explorer.theme'))).toBe('system');
});

test('кнопка темы работает при запрете локального хранилища', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage is unavailable', 'SecurityError');
      },
    });
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.getByRole('button', { name: 'System theme. Use dark theme' }).click();
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(32, 29, 35)');
});
