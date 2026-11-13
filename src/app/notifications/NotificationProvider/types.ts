import type { NotificationEvent } from '../types';
import type { ReactNode } from 'react';


export interface QueuedNotification extends NotificationEvent {
  id: number;
}
export interface NotificationProviderProps {
  children: ReactNode;
}
