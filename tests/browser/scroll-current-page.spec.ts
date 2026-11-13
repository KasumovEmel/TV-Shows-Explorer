import { expect, test } from '@playwright/test';

import { searchRoute } from './mockSearch';


for (const viewport of [
  { width: 2300, height: 1206 },
  { width: 390, height: 844 },
]) {
  test('прокрутка через все четыре страницы, ширина ' + viewport.width, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route(searchRoute, (route) =>
      route.fulfill({
        json: Array.from({ length: 10 }, (_, i) => ({
          show: { id: i + 1, name: 'Show ' + (i + 1), genres: [], image: null },
        })),
      }),
    );
    await page.goto('/');
    await page.getByRole('searchbox').fill('test');
    const current = page.getByRole('navigation').locator('[aria-current="page"]');
    await expect(current).toHaveText('1');
    const cards = page.getByRole('listitem');

    const atEnd = () =>
      page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 1);

    let checkedFirstOverlap = false;
    let checkedLastBeforeFooter = false;
    for (const direction of [1, -1]) {
      const seen = [await current.innerText()];
      for (let step = 0; step < 80; step++) {
        await page.mouse.wheel(0, 48 * direction);
        await page.evaluate(
          () =>
            new Promise<void>((done) =>
              requestAnimationFrame(() => requestAnimationFrame(() => done())),
            ),
        );
        const active = await current.innerText();
        const listBounds = await page
          .locator('ul[id^="page-"]')
          .evaluateAll((lists) => lists.map((list) => list.getBoundingClientRect().toJSON()));
        const toolbar = await page.getByRole('navigation').locator('..').boundingBox();
        const [first, second, , last] = listBounds;
        if (
          first.top >= toolbar!.y + toolbar!.height &&
          second?.top < viewport.height &&
          second.bottom > viewport.height
        ) {
          expect(active, 'Первая тройка видна целиком, вторая только частично').toBe('1');
          checkedFirstOverlap = true;
        }
        if (
          last?.bottom <= viewport.height &&
          last.top >= toolbar!.y + toolbar!.height &&
          !(await atEnd())
        ) {
          expect(active, 'Видна вся последняя группа, ниже ещё остаётся подвал').toBe('4');
          checkedLastBeforeFooter = true;
        }
        if (active !== seen.at(-1)) {
          seen.push(active);
          await expect(page.getByRole('list', { name: 'Page ' + active })).toBeInViewport();
        }
        if (direction > 0 && (await cards.count()) === 10 && (await atEnd())) {
          break;
        }
        if (direction < 0 && (await page.evaluate(() => scrollY === 0))) {
          break;
        }
      }
      expect(seen).toEqual(direction > 0 ? ['1', '2', '3', '4'] : ['4', '3', '2', '1']);
      if (direction > 0) {
        const footer = await page.locator('footer').boundingBox();
        expect(viewport.height - footer!.y - footer!.height).toBeLessThanOrEqual(48);
        await expect(cards.last()).toBeInViewport({ ratio: 0.99 });
        const stop = await page.evaluate(() => scrollY);
        await page.mouse.wheel(0, viewport.height);
        await expect(current).toHaveText('4');
        expect(await page.evaluate(() => scrollY)).toBe(stop);
      }
    }
    if (viewport.width === 2300) {
      expect(checkedFirstOverlap).toBe(true);
    }
    expect(checkedLastBeforeFooter).toBe(true);
    await expect(cards).toHaveCount(10);
  });
}
