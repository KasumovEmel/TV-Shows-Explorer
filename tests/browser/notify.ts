import type { NotificationEvent } from '../../src/app/notifications';
import type { Page } from '@playwright/test';


export async function notify(page: Page, ...events: NotificationEvent[]) {
  await page.evaluate((items) => {
    for (const detail of items) {
      window.dispatchEvent(new CustomEvent('fixture:notify', { detail }));
    }
  }, events);
}
