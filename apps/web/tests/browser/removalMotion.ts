import { expect } from '@playwright/test';
import type { JSHandle, Locator } from '@playwright/test';


export function pauseRemoval(row: Locator) {
  return row.evaluateHandle((element) => {
    const motions: Animation[] = [];
    const observer = new MutationObserver(() => {
      for (const motion of element.parentElement!.getAnimations({ subtree: true })) {
        motion.pause();
        motions.push(motion);
      }
      observer.disconnect();
    });
    observer.observe(element, { attributeFilter: ['data-removing'] });

    return motions;
  });
}

export async function seekRemoval(motions: JSHandle<Animation[]>, time: number) {
  await expect.poll(() => motions.evaluate((list) => list.length)).toBeGreaterThan(0);
  await motions.evaluate((list, ms) => {
    for (const motion of list) {
      motion.currentTime = ms;
    }
  }, time);
}
