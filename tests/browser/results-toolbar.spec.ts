import { expect, test } from '@playwright/test';

import { searchRoute } from './mockSearch';


for (const width of [320, 1440]) {
  test(`панели над карточками сохраняют высоту при разном числе жанров и страниц, ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const field = page.getByRole('searchbox');
    await expect(field).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    for (const total of [1, 30]) {
      const request = page.waitForRequest(searchRoute);
      let release!: () => void;
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(
        searchRoute,
        async (route) => {
          await pending;
          await route.fulfill({
            json: Array.from({ length: total }, (_, i) => ({
              show: {
                id: i,
                name: 'Show ' + i,
                genres: total === 1 ? [] : ['Genre ' + i],
                premiered: null,
                image: null,
              },
            })),
          });
        },
        { times: 1 },
      );
      await field.fill(String(total));
      await field.press('Enter');
      await request;
      const main = page.getByRole('main');
      const skeleton = main.locator('ul[aria-hidden="true"] > li').first();
      await expect(skeleton).toBeVisible();
      const before = await skeleton.boundingBox();
      await expect(main.locator('[inert] i').first()).toBeVisible();
      await expect(main.getByRole('group')).toHaveCount(0);
      await expect(main.getByRole('navigation')).toHaveCount(0);
      await expect(main.getByRole('button')).toHaveCount(0);
      const footer = main.locator('footer');
      await expect(footer).toHaveAttribute('aria-hidden', 'true');
      await expect(footer.locator('a, [tabindex]')).toHaveCount(0);
      const loadingFooter = await footer.boundingBox();
      release();
      const firstCard = main.getByRole('listitem').first();
      await expect(firstCard).toBeVisible();
      expect((await firstCard.boundingBox())!.y).toBe(before!.y);
      await expect(footer.getByRole('link', { name: 'Data from TVmaze' })).toBeVisible();
      if (total > 1) {
        await expect(footer.getByRole('status')).toContainText('Showing 3 of 30');
        expect((await footer.boundingBox())!.height).toBe(loadingFooter!.height);
        const last = main.getByRole('button', { name: 'Genre 29', exact: true });
        await last.focus();
        await expect(last).toBeInViewport();
        await last.press('Space');
        await expect(last).toHaveAttribute('aria-pressed', 'true');
      } else {
        await expect(main.getByRole('group')).toHaveCount(0);
        await expect(main.getByRole('navigation')).toHaveCount(0);
      }
    }
  });
}
