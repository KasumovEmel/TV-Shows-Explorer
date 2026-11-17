import type { EnqueueNotificationParams } from '../types';


export function enqueueNotification({ queue, item }: EnqueueNotificationParams) {
  const front = queue.at(-1);
  if (!item.show && front?.kind === item.kind && front.messageKey === item.messageKey) {
    return [...queue.slice(0, -1), item];
  }

  return [...queue, item];
}
