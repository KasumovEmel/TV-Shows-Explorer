import { expect, test } from '@playwright/test';


test.beforeEach(async ({ page }) => {
  const items = ['First', 'Second', 'Third', 'Fourth'].map((originalTitle, i) => ({
    id: String(201 + i),
    originalTitle,
    genres: [],
  }));
  await page.route('**/api/favorites', (route) => route.fulfill({ json: { items } }));
  await page.route('**/api/favorites/count', (route) =>
    route.fulfill({ json: { count: items.length } }),
  );
  await page.route(/\/api\/favorites\/\d+$/, (route) => {
    const id = route.request().url().split('/').at(-1);
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items.splice(index, 1);
    }

    return route.fulfill({ status: 204 });
  });
  await page.addInitScript(() => {
    Object.defineProperty(document, 'startViewTransition', { value: undefined });
  });
  await page.goto('/favorites');
});

test('сердце и соседи движутся даже без View Transitions', async ({ page }) => {
  const rows = page.getByRole('listitem');
  await expect(rows).toHaveCount(4);
  await page.evaluate(() => document.fonts.ready);

  const positions = () =>
    rows.evaluateAll((list) => list.map((row) => row.getBoundingClientRect().y));

  const start = await positions();
  const remove = page.getByRole('button', { name: 'Remove Second' });
  await page.route('**/api/favorites/202', (r) => r.fulfill({ status: 500 }), { times: 1 });
  await remove.click();
  await expect(page.locator('[data-kind="error"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Favorites (4)' })).toBeVisible();
  await expect(remove).toBeEnabled();
  const motions = await rows.nth(1).evaluateHandle((row) => {
    const observed: Animation[] = [];
    const observer = new MutationObserver(() => {
      const list = row.parentElement!;
      for (const motion of list.getAnimations({ subtree: true })) {
        motion.pause();
        motion.currentTime = 45;
        observed.push(motion);
      }
      observer.disconnect();
    });
    observer.observe(row, { attributes: true, attributeFilter: ['data-removing'] });

    return observed;
  });
  await remove.click();
  await expect.poll(() => motions.evaluate((list) => list.length)).toBe(4);
  const scale = await remove
    .locator('svg')
    .evaluate((svg) => new DOMMatrix(getComputedStyle(svg).transform).a);
  expect(scale).toBeGreaterThan(0);
  expect(scale).toBeLessThan(1);
  await expect(rows.nth(1)).toHaveCSS('opacity', '1');
  await motions.evaluate((list) =>
    list.forEach((motion) => {
      motion.currentTime = 125;
    }),
  );
  const middle = await positions();
  expect(middle[0]).toBe(start[0]);
  for (const index of [2, 3]) {
    expect(middle[index]).toBeLessThan(start[index]);
    expect(middle[index]).toBeGreaterThan(start[index - 1]);
  }
  const opacity = await rows.nth(1).evaluate((row) => Number(getComputedStyle(row).opacity));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  expect(
    await motions.evaluate((list) =>
      Math.max(...list.map((m) => Number(m.effect!.getComputedTiming().endTime))),
    ),
  ).toBeLessThanOrEqual(200);
  await motions.evaluate((list) => list.forEach((motion) => motion.finish()));
  await expect(rows.getByRole('heading')).toHaveText(['First', 'Third', 'Fourth']);
  expect(await positions()).toEqual(start.slice(0, 3));
});

test('два подтверждения подряд удаляют обе строки', async ({ page }) => {
  const rows = page.getByRole('listitem');
  await expect(rows).toHaveCount(4);
  await page.evaluate(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('main li button');
    buttons[1].click();
    buttons[2].click();
  });
  await expect(rows.getByRole('heading')).toHaveText(['First', 'Fourth']);
  await expect(page.getByRole('heading', { name: 'Favorites (2)' })).toBeVisible();
  await expect(rows.last()).toHaveCSS('transform', 'none');
});

test('при уменьшенном движении удаление проходит сразу', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const animations = await page.evaluateHandle(() => {
    const names: string[] = [];
    document.addEventListener('animationstart', (event) => names.push(event.animationName));

    return names;
  });
  await page.getByRole('button', { name: 'Remove Second' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(3);
  expect(await animations.jsonValue()).toEqual([]);
});
