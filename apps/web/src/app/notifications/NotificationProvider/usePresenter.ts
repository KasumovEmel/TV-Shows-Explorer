import { useCallback, useEffect, useRef, useState } from 'react';

import { enqueueNotification } from './logic/enqueueNotification';
import type { NotificationEvent } from '../types';
import type { NotificationProviderProps, NotificationStack } from './types';


export function usePresenter({ children }: NotificationProviderProps) {
  const [stack, setStack] = useState<NotificationStack>({ queue: [] });
  const nextId = useRef(0);

  const notify = useCallback((event: NotificationEvent) => {
    const item = { ...event, id: ++nextId.current };
    setStack(({ queue }) => ({ queue: enqueueNotification({ queue, item }) }));
  }, []);

  const dismiss = useCallback((id: number) => {
    setStack((current) => {
      const front = current.queue.at(-1);
      if (front?.id !== id) {
        return current;
      }
      const queue = current.queue.slice(0, -1);

      return { queue, departing: queue.length ? front : undefined };
    });
  }, []);

  const expire = useCallback((id: number) => {
    setStack((current) => (current.queue.at(-1)?.id === id ? { queue: [] } : current));
  }, []);

  const finishExit = useCallback((id: number) => {
    setStack((current) => (current.departing?.id === id ? { queue: current.queue } : current));
  }, []);

  useEffect(() => {
    const offline = () => notify({ kind: 'warning' });

    window.addEventListener('offline', offline);

    return () => window.removeEventListener('offline', offline);
  }, [notify]);

  return {
    children,
    cards: stack.queue.slice(-3),
    departing: stack.departing,
    notify,
    dismiss,
    expire,
    finishExit,
  };
}
