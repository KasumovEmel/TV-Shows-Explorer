import { expect, test } from '@playwright/test';

import { mockSearch, searchRoute } from './mockSearch';


for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`отправка запроса перемещает поле и проявляет три скелетона; движение: ${reducedMotion}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await mockSearch(page);
    let release!: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(searchRoute, async (route) => {
      await pending;
      await route.fallback();
    });
    await page.goto('/');
    const field = page.getByRole('searchbox');
    const intro = page.getByRole('region', { name: 'What to watch?' });
    const input = await field.elementHandle();
    const results = page.getByRole('main');
    const skeletons = results.getByRole('status').locator('ul[aria-hidden="true"] > li');
    const motions = await intro.evaluateHandle((el) => {
      const motions: Animation[] = [];
      const observer = new MutationObserver(() => {
        for (const motion of document.getAnimations()) {
          if (motions.includes(motion)) {
            continue;
          }
          motion.pause();
          motion.currentTime = 0;
          motions.push(motion);
        }
      });
      observer.observe(el, { attributes: true });

      return motions;
    });
    await page.evaluate(() => document.fonts.ready);
    const form = page.getByRole('search');
    const start = await form.boundingBox();
    const request = page.waitForRequest(searchRoute);
    await field.fill('night');
    await field.evaluate((el: HTMLInputElement) => el.setSelectionRange(1, 4));
    await field.press('Enter');
    await request;
    await expect(intro).toHaveAttribute('data-docked', '');
    await expect(skeletons).toHaveCount(3);
    const moving = reducedMotion === 'no-preference';
    expect(await motions.evaluate((list) => list.length)).toBe(moving ? 2 : 0);
    if (moving) {
      expect(await form.boundingBox()).toEqual(start);
      await expect(results).toHaveCSS('opacity', '0');
      await motions.evaluate((list) => {
        for (const motion of list) {
          motion.currentTime = Number(motion.effect!.getComputedTiming().duration) / 2;
        }
      });
      const middle = await form.boundingBox();
      const opacity = await results.evaluate((el) => Number(getComputedStyle(el).opacity));
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
      const response = page.waitForResponse(searchRoute);
      release();
      await (await response).finished();
      await expect(skeletons).toHaveCount(3);
      await expect(page.getByRole('listitem')).toHaveCount(0);
      await motions.evaluate((list) => list.forEach((motion) => motion.finish()));
      const end = await form.boundingBox();
      expect(middle!.y).toBeLessThan(start!.y);
      expect(middle!.y).toBeGreaterThan(end!.y);
    } else {
      await expect(results).toHaveCSS('opacity', '1');
      release();
    }
    await expect(page.getByRole('listitem')).toHaveCount(3);
    expect(await input!.evaluate((el) => el === document.activeElement)).toBe(true);
    expect(
      await field.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd]),
    ).toEqual([1, 4]);
    await field.fill('a');
    await expect(page.getByRole('heading', { name: 'The Bear' })).toBeVisible();
    expect(await motions.evaluate((list) => list.length)).toBe(moving ? 2 : 0);
    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(intro).not.toHaveAttribute('data-docked');
    if (moving) {
      await motions.evaluate((list) => list[list.length - 1].finish());
    }
    expect(await form.boundingBox()).toEqual(start);
    await expect(field).toBeFocused();
    await expect(page.getByRole('listitem')).toHaveCount(0);
    // Cache hits must dock the field too, even without a new network request.
    await field.fill('night');
    await expect(intro).toHaveAttribute('data-docked', '');
    if (moving) {
      await motions.evaluate((list) => list.slice(-2).forEach((motion) => motion.finish()));
    }
    await expect(page.getByRole('listitem')).toHaveCount(3);
  });
}
