import type { NotificationEvent } from '@shared/types/notification';
import type { ReactNode } from 'react';


export interface QueuedNotification extends NotificationEvent {
  id: number;
}
export interface NotificationProviderProps {
  children: ReactNode;
}
