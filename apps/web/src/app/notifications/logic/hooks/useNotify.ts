import { useContext } from 'react';

import { NotifyContext } from '../../context';


export function useNotify() {
  const notify = useContext(NotifyContext);

  if (!notify) {
    throw new Error('NotificationProvider is missing');
  }

  return notify;
}
