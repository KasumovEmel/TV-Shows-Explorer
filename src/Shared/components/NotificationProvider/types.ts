import type { ReactNode } from 'react';
import type { NotificationEvent } from '@shared/types/notification';
export interface QueuedNotification extends NotificationEvent {
  id: number;
}
export interface NotificationProviderProps {
  children: ReactNode;
}
