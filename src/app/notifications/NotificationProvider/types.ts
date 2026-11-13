import type { ReactNode } from 'react';

import type { NotificationEvent } from '../types';


export interface QueuedNotification extends NotificationEvent {
  id: number;
}
export interface NotificationProviderProps {
  children: ReactNode;
}
