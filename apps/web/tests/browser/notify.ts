import type { NotifyParams } from './types';


export async function notify({ page, events }: NotifyParams) {
  await page.evaluate((items) => {
    for (const detail of items) {
      window.dispatchEvent(new CustomEvent('fixture:notify', { detail }));
    }
  }, events);
}
