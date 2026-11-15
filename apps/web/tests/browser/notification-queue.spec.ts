import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { notify } from './notify';


async function openFixture(page: Page) {
  await page.goto('/fixture.html');
  await page.getByRole('searchbox').focus();
  await page.clock.install({ time: new Date('2026-01-01T12:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T12:00:01Z'));
}

test('только последний Toast виден и вся стопка исчезает через три секунды после него', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFixture(page);
  await notify(page, { kind: 'error' }, { kind: 'warning' });
  const card = page.locator('[data-kind]');
  await expect(card).toHaveAttribute('data-kind', 'warning');
  await page.clock.fastForward(2500);
  await notify(page, {
    kind: 'success',
    messageKey: 'favorites.added',
    show: { id: '1', originalTitle: 'Night Flight' },
  });
  await expect(card).toHaveCount(1);
  await expect(card).toContainText('Added Night Flight to favorites.');
  await expect(page.getByRole('button', { name: 'Dismiss notification' })).toHaveCount(1);
  const edges = await card
    .locator('[data-depth]')
    .evaluateAll((layers) => layers.map((layer) => layer.getBoundingClientRect().toJSON()));
  expect(edges).toHaveLength(3);
  expect(edges[0].top).toBeLessThan(edges[1].top);
  expect(edges[0].left).toBeGreaterThan(edges[1].left);
  expect(edges[1].top).toBeLessThan(edges[2].top);
  expect(edges[1].left).toBeGreaterThan(edges[2].left);
  await page.screenshot({
    path: info.outputPath('toast-stack.png'),
    clip: { x: 0, y: 0, width: 390, height: 118 },
  });
  await page.clock.fastForward(2999);
  await expect(card).toBeVisible();
  await page.clock.fastForward(1);
  await expect(card).toHaveCount(0);
});

test('крестик открывает предыдущие карточки по одной с полным новым интервалом', async ({
  page,
}) => {
  await openFixture(page);
  const card = page.locator('[data-kind]');
  await notify(page, { kind: 'error' });
  await expect(card).toHaveAttribute('data-kind', 'error');
  await page.clock.fastForward(2200);
  await notify(page, { kind: 'warning' });
  await expect(card).toHaveAttribute('data-kind', 'warning');
  await page.clock.fastForward(2200);
  await notify(page, { kind: 'info' });
  await expect(card).toHaveAttribute('data-kind', 'info');
  const close = card.getByRole('button');
  await close.click();
  await page.mouse.move(0, 0);
  await expect(card).toHaveAttribute('data-kind', 'warning');
  await page.clock.fastForward(2999);
  await expect(card).toBeVisible();
  await close.press('Enter');
  await expect(page.getByRole('searchbox')).toBeFocused();
  await expect(card).toHaveAttribute('data-kind', 'error');
  await page.clock.fastForward(2999);
  await expect(card).toBeVisible();
  await page.clock.fastForward(1);
  await expect(card).toHaveCount(0);
});

test('фокус и наведение удерживают стопку при смене сообщения и сохраняют остаток', async ({
  page,
}) => {
  await openFixture(page);
  await notify(page, { kind: 'info' });
  const card = page.locator('[data-kind]');
  const close = card.getByRole('button');
  await close.focus();
  await notify(page, { kind: 'warning' });
  await expect(card).toHaveAttribute('data-kind', 'warning');
  await expect(close).toBeFocused();
  await page.clock.fastForward(10000);
  await expect(card).toBeVisible();
  await page.getByRole('searchbox').focus();
  await page.clock.fastForward(1000);
  await card.hover();
  await page.clock.fastForward(10000);
  await expect(card).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(1999);
  await expect(card).toBeVisible();
  await page.clock.fastForward(1);
  await expect(card).toHaveCount(0);
});

test('потеря сети в обычном приложении вызывает предупреждение', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('searchbox')).toBeVisible();
  await page.context().setOffline(true);
  await expect(page.getByText('Network connection lost.')).toBeVisible();
});
