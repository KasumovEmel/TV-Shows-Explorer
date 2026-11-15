import { createContext, useContext } from 'react';

import type { NotificationEvent } from './types';


export const NotifyContext = createContext<((event: NotificationEvent) => void) | null>(null);

export function useNotify() {
  const notify = useContext(NotifyContext);

  if (!notify) {
    throw new Error('NotificationProvider is missing');
  }

  return notify;
}
