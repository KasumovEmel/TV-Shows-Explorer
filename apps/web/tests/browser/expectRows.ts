import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';


export async function expectRows(rows: Locator, container: Locator) {
  const bounds = await container.boundingBox();
  let bottom = 0;
  await expect(rows).toHaveCount(3);
  for (const row of await rows.all()) {
    const box = await row.boundingBox();
    expect(box!.x).toBe(bounds!.x);
    expect(box!.width).toBe(bounds!.width);
    expect(box!.y).toBeGreaterThanOrEqual(bottom);
    bottom = box!.y + box!.height;
  }
}
