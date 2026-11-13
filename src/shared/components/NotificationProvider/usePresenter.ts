import { useCallback, useEffect, useRef, useState } from 'react';

import type { NotificationProviderProps, QueuedNotification } from './types';
import type { NotificationEvent } from '@shared/types/notification';


export function usePresenter({ children }: NotificationProviderProps) {
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
  const active = queue[0];
  return {
    children,
    alert: active?.kind === 'error' ? active : null,
    status: active?.kind !== 'error' ? active : null,
    notify,
    dismiss,
  };
}
