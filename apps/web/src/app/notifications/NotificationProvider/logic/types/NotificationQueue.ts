import type { QueuedNotification } from '../../types';


export interface NotificationStack {
  queue: QueuedNotification[];
  departing?: QueuedNotification;
}

export interface EnqueueNotificationParams {
  queue: QueuedNotification[];
  item: QueuedNotification;
}
