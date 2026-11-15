import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';


async function watchCount(control: Locator) {
  return control.evaluateHandle((root) => {
    const rolls: Animation[] = [];
    root.addEventListener('animationstart', (event) => {
      const track = event.target as HTMLElement;
      const roll = track.getAnimations()[0];
      roll.pause();
      roll.currentTime = 80;
      rolls.push(roll);
    });

    return rolls;
  });
}

test('число прокручивается вверх при сохранении и вниз при удалении', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const favorites = page.getByRole('link', { name: 'Favorites' });
  await expect(favorites).toHaveText('0');
  expect(await favorites.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
  const adds = await watchCount(favorites);
  await page.getByRole('searchbox').fill('night');
  await page.getByRole('button', { name: 'Save Night Flight' }).click();
  const incoming = favorites.locator('[data-previous]');
  await expect(incoming).toHaveAttribute('data-previous', '0');
  await expect.poll(() => adds.evaluate((rolls) => rolls.length)).toBe(1);

  const offset = (track: Locator) =>
    track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);

  expect(await offset(incoming)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Save Night Radio' }).click();
  await expect(favorites).toHaveAccessibleName('Favorites (2)');
  await expect(incoming).toHaveAttribute('data-previous', '1');
  await expect.poll(() => adds.evaluate((rolls) => rolls.length)).toBe(2);
  expect(await adds.evaluate((rolls) => rolls[0].playState)).toBe('idle');
  await adds.evaluate((rolls) => rolls[1].finish());
  await expect(incoming).toHaveCount(0);
  await favorites.click();
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toHaveAccessibleName('Favorites (2)');
  const removals = await watchCount(heading);
  await page.getByRole('button', { name: 'Remove Night Radio' }).click();
  await expect(heading).toHaveAccessibleName('Favorites (1)');
  await expect.poll(() => removals.evaluate((rolls) => rolls.length)).toBe(1);
  const outgoing = heading.locator('[data-previous]');
  await expect(outgoing).toHaveAttribute('data-previous', '2');
  expect(await offset(outgoing)).toBeLessThan(0);
  await removals.evaluate((rolls) => rolls[0].finish());
  await expect(outgoing).toHaveCount(0);
});
