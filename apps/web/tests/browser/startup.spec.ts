import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';


async function holdRequests(page: Page, pattern: RegExp) {
  const requested = page.waitForRequest(pattern);
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(pattern, async (route) => {
    await pending;
    await route.continue();
  });

  return { requested, release };
}

test('индикатор виден до скриптов, стилей и русского словаря', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('tv-shows-explorer.language', 'ru');
    localStorage.setItem('tv-shows-explorer.theme', 'dark');
  });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  const scripts = await holdRequests(page, /\/index\.[^/]+\.js$/);
  const styles = await holdRequests(page, /\.css$/);
  const locale = await holdRequests(page, /\/locale-ru\.[^/]+\.js$/);
  await page.goto('/', { waitUntil: 'commit' });
  const loader = page.getByRole('progressbar', { name: 'Season One' });
  await scripts.requested;
  await expect(loader).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => performance.getEntriesByName('first-contentful-paint').length))
    .toBe(1);
  await expect(loader).toHaveCSS('background-color', 'rgb(32, 29, 35)');
  expect(await loader.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect
    .poll(() => loader.evaluate((el) => el.getAnimations({ subtree: true }).length))
    .toBe(2);
  scripts.release();
  await Promise.all([styles.requested, locale.requested]);
  await expect(loader).toBeVisible();
  const receivedStyles = page.waitForResponse(/\.css$/);
  styles.release();
  await (await receivedStyles).finished();
  await expect(loader).toBeVisible();
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  locale.release();
  await expect(page.getByRole('searchbox', { name: 'Поиск сериалов' })).toBeVisible();
  await expect(loader).toHaveCount(0);
});

for (const locale of ['ru', 'en']) {
  test(
    'поздние шрифты не меняют положение поля или рисунок подсказки: ' + locale,
    async ({ page }) => {
      await page.setViewportSize({ width: locale === 'ru' ? 1440 : 390, height: 844 });
      await page.addInitScript(
        (language) => localStorage.setItem('tv-shows-explorer.language', language),
        locale,
      );
      const fonts = await holdRequests(page, /\.(ttf|woff2?)$/);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const field = page.getByRole('searchbox');
      await expect(field).toBeVisible();
      await fonts.requested;
      const area = (await field.boundingBox())!;
      // Capture the actual glyphs while font responses are still held.
      // Playwright's regular screenshot waits for document.fonts.ready.
      const cdp = await page.context().newCDPSession(page);

      const capture = async () =>
        (
          await cdp.send('Page.captureScreenshot', {
            clip: { ...area, scale: 1 },
          })
        ).data;

      await expect
        .poll(() => page.evaluate(() => performance.getEntriesByType('paint').length))
        .toBeGreaterThan(0);
      const before = await capture();
      fonts.release();
      await page.evaluate(() => document.fonts.ready);
      expect(await field.boundingBox()).toEqual(area);
      expect((await capture()) === before).toBe(true);
    },
  );
}
