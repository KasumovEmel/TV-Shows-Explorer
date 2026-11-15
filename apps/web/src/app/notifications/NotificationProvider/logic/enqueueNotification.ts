import type { QueuedNotification } from '../types';


export function enqueueNotification(queue: QueuedNotification[], item: QueuedNotification) {
  const active = queue[0];
  if (active?.kind === item.kind && active.messageKey === item.messageKey) {
    return queue;
  }

  return [...queue, item];
}
