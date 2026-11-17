import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

import { notify } from './notify';


async function pauseNextMove(stack: Locator) {
  return stack.evaluateHandle((el) => {
    const motions: Animation[] = [];
    const observer = new MutationObserver(() => {
      const transitions = el
        .getAnimations({ subtree: true })
        .filter(
          (motion) => motion instanceof CSSTransition && motion.transitionProperty === 'transform',
        );
      if (!transitions.length) {
        return;
      }
      observer.disconnect();
      for (const motion of transitions) {
        motion.pause();
        motion.currentTime = 80;
        motions.push(motion);
      }
    });
    observer.observe(el, { attributes: true, childList: true, subtree: true });

    return motions;
  });
}

function translation(layer: Locator) {
  return layer.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
}

test('при добавлении и закрытии обе карточки движутся между слоями', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/fixture.html');
  await page.getByRole('searchbox').focus();
  await notify({ page, events: [{ kind: 'info' }] });
  const stack = page.locator('[data-kind]');
  const previous = stack.locator('[data-tone="info"]');
  const latest = stack.locator('[data-tone="warning"]');
  await previous.evaluate(async (el) =>
    Promise.all(el.getAnimations().map((m) => m.finished)).then(() => {}),
  );
  const push = await pauseNextMove(stack);
  await notify({ page, events: [{ kind: 'warning' }] });
  await expect.poll(() => push.evaluate((moves) => moves.length)).toBe(2);
  const receding = await translation(previous);
  expect(receding).toBeGreaterThan(-5);
  expect(receding).toBeLessThan(0);
  expect(await translation(latest)).toBeGreaterThan(0);
  await push.evaluate((moves) => moves.forEach((m) => m.finish()));
  await expect.poll(() => translation(previous)).toBe(-5);
  const pop = await pauseNextMove(stack);
  await stack.getByRole('button').press('Enter');
  await expect.poll(() => pop.evaluate((moves) => moves.length)).toBe(2);
  const returning = await translation(previous);
  expect(returning).toBeGreaterThan(-5);
  expect(returning).toBeLessThan(0);
  expect(await translation(latest)).toBeGreaterThan(0);
  await expect(latest).toHaveAttribute('inert', '');
  await expect(stack.getByRole('button')).toHaveCount(1);

  // A new event interrupts the still-paused exit.
  await notify({ page, events: [{ kind: 'success' }] });
  await expect(stack).toHaveAttribute('data-kind', 'success');
  await expect(latest).toHaveCount(0);
  await stack.getByRole('button').press('Enter');
  await expect(stack).toHaveAttribute('data-kind', 'info');
  await expect(stack.locator('[data-depth="departing"]')).toHaveCount(0);
});

test('при уменьшенном движении смена слоя происходит сразу', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fixture.html');
  await page.getByRole('searchbox').focus();
  await notify({ page, events: [{ kind: 'error' }, { kind: 'success' }] });
  const stack = page.locator('[data-kind]');

  const motions = () => stack.evaluate((el) => el.getAnimations({ subtree: true }).length);

  await expect(stack).toHaveAttribute('data-kind', 'success');
  expect(await motions()).toBe(0);
  await stack.getByRole('button').press('Enter');
  await expect(stack).toHaveAttribute('data-kind', 'error');
  await expect(stack.locator('[data-depth="departing"]')).toHaveCount(0);
  expect(await motions()).toBe(0);
});
