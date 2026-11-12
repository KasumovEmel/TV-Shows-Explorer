import { useCallback, useEffect, useRef, useState } from 'react';

import type { QueuedNotification } from './types';
import type { NotificationEvent } from '@shared/types/notification';


export function usePresenter() {
  const [queue, setQueue] = useState<QueuedNotification[]>([]);
  const nextId = useRef(0);
  const notify = useCallback((event: NotificationEvent) => {
    const item = { ...event, id: ++nextId.current };
    setQueue((items) =>
      items[0]?.kind === item.kind && items[0].messageKey === item.messageKey
        ? items
        : [...items, item],
    );
  }, []);
  const dismiss = useCallback(
    (id: number) => setQueue((items) => (items[0]?.id === id ? items.slice(1) : items)),
    [],
  );
  useEffect(() => {
    const offline = () => notify({ kind: 'warning' });
    window.addEventListener('offline', offline);
    return () => window.removeEventListener('offline', offline);
  }, [notify]);
  return { active: queue[0], notify, dismiss };
}
