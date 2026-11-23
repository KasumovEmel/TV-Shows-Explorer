import { test as base, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';


export { expect };
export const test = base.extend({
  // oxlint-disable-next-line project/object-parameters -- Playwright передаёт зависимости и use отдельно.
  page: async ({ page }, use) => {
    const response = await page.request.post('/api/auth/login', {
      data: { email: randomUUID() + '@example.test' },
    });
    expect(response.status()).toBe(200);
    await use(page);
  },
});
