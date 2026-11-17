import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';

import type { SeekRemovalParams } from './types';


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

export async function seekRemoval({ motions, time }: SeekRemovalParams) {
  await expect.poll(() => motions.evaluate((list) => list.length)).toBeGreaterThan(0);
  // oxlint-disable-next-line project/object-parameters -- Playwright передаёт объект JSHandle и аргумент evaluate отдельно.
  await motions.evaluate((list, ms) => {
    for (const motion of list) {
      motion.currentTime = ms;
    }
  }, time);
}
