import { createContext, useContext } from 'react';

import type { Notify } from './types';


export const NotifyContext = createContext<Notify | null>(null);

export function useNotify() {
  const notify = useContext(NotifyContext);

  if (!notify) {
    throw new Error('NotificationProvider is missing');
  }

  return notify;
}
