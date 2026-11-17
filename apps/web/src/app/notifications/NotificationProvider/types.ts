import type { ReactNode } from 'react';

import type { NotificationEvent } from '../types';


export interface QueuedNotification extends NotificationEvent {
  id: number;
}

export interface NotificationProviderProps {
  children: ReactNode;
}

export interface NotificationStack {
  queue: QueuedNotification[];
  departing?: QueuedNotification;
}

export interface EnqueueNotificationParams {
  queue: QueuedNotification[];
  item: QueuedNotification;
}
