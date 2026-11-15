import type { QueuedNotification } from '../types';


export function enqueueNotification(queue: QueuedNotification[], item: QueuedNotification) {
  const front = queue.at(-1);
  if (!item.show && front?.kind === item.kind && front.messageKey === item.messageKey) {
    return [...queue.slice(0, -1), item];
  }

  return [...queue, item];
}
