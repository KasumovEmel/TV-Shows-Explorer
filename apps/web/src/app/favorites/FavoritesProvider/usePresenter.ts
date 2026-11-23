import { useCallback, useEffect, useState } from 'react';

import { listFavorites } from '../logic/tasks/listFavorites';
import * as api from '@/api/generated/catalog';
import { useRequestError } from '@/app/notifications';
import type { Show } from '@/app/show.types';


export function usePresenter() {
  const [items, setItems] = useState<Show[]>();
  const [count, setCount] = useState<number>();
  const [isListNeeded, setIsListNeeded] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const onError = useRequestError();

  const requestList = useCallback(() => setIsListNeeded(true), []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      try {
        if (isListNeeded) {
          const shows = await listFavorites(() => api.listFavorites({ signal }));
          if (!signal.aborted) {
            setItems(shows);
          }
        } else {
          const result = await api.countFavorites({ signal });
          if (!signal.aborted) {
            setCount(result.count);
          }
        }
      } catch (error) {
        if (!signal.aborted) {
          setIsFailed(isListNeeded);
          onError(error);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [isListNeeded, attempt, onError]);

  function retry() {
    setIsFailed(false);
    setAttempt((n) => n + 1);
  }

  return { items, setItems, count: items?.length ?? count, isFailed, requestList, retry };
}
