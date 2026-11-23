import { useCallback, useEffect, useRef, useState } from 'react';

import { listFavorites } from '../tasks/listFavorites';
import * as api from '@/api/generated/catalog';
import { useRequestError } from '@/app/notifications';
import type { FavoriteSnapshot, UpdateFavorites } from '../types/FavoriteOperations';


export function useFavoriteList(isFavoritesPage: boolean) {
  const [snapshot, setSnapshot] = useState<FavoriteSnapshot>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const isInitialSearch = useRef(!isFavoritesPage);
  const listRequest = useRef<AbortController | null>(null);
  const onError = useRequestError();

  const refresh = useCallback(() => {
    if (listRequest.current) {
      return;
    }
    const controller = new AbortController();
    listRequest.current = controller;
    setIsLoading(true);
    setIsFailed(false);
    void listFavorites(() => api.listFavorites({ signal: controller.signal }))
      .then((items) => {
        if (!controller.signal.aborted) {
          setSnapshot(items);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setIsFailed(true);
          onError(error);
        }
      })
      .finally(() => {
        if (listRequest.current === controller) {
          listRequest.current = null;
          setIsLoading(false);
        }
      });
  }, [onError]);

  useEffect(() => {
    const controller = new AbortController();
    if (isInitialSearch.current) {
      void api
        .countFavorites({ signal: controller.signal })
        .then(({ count }) => {
          if (!controller.signal.aborted) {
            setSnapshot((current) => current ?? count);
          }
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            onError(error);
          }
        });
    }

    return () => {
      controller.abort();
      listRequest.current?.abort();
      listRequest.current = null;
    };
  }, [onError]);

  const commit = useCallback((update: UpdateFavorites) => {
    listRequest.current?.abort();
    listRequest.current = null;
    setSnapshot((current) => update(Array.isArray(current) ? current : []));
    setIsLoading(false);
    setIsFailed(false);
  }, []);

  return {
    items: Array.isArray(snapshot) ? snapshot : undefined,
    count: Array.isArray(snapshot) ? snapshot.length : snapshot,
    isLoading,
    isFailed,
    refresh,
    commit,
  };
}
