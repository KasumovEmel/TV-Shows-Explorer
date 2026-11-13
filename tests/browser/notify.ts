import type { Page } from '@playwright/test';
import type { NotificationEvent } from '@shared/components/NotificationProvider';


export async function notify(page: Page, ...events: NotificationEvent[]) {
  await page.evaluate((items) => {
    for (const detail of items) {
      window.dispatchEvent(new CustomEvent('fixture:notify', { detail }));
    }
  }, events);
}
