import { useCallback, useEffect, useRef, useState } from 'react';

import { listFavorites } from '../tasks/listFavorites';
import * as api from '@/api/generated/catalog';
import type {
  FavoriteAccess,
  FavoriteSnapshot,
  UpdateFavorites,
} from '../types/FavoriteOperations';


export function useFavoriteList({ signal, onError }: FavoriteAccess) {
  const [snapshot, setSnapshot] = useState<FavoriteSnapshot>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const listRequest = useRef<AbortController | null>(null);
  const [previous, setPrevious] = useState(signal);
  if (previous !== signal) {
    setPrevious(signal);
    setSnapshot(undefined);
    setIsLoading(false);
    setIsFailed(false);
  }

  const refresh = useCallback(() => {
    if (!signal || signal.aborted || listRequest.current) {
      return;
    }
    const controller = new AbortController();
    listRequest.current = controller;
    setIsLoading(true);
    setIsFailed(false);
    const requestSignal = AbortSignal.any([controller.signal, signal]);
    void listFavorites(() => api.listFavorites({ signal: requestSignal }))
      .then((items) => {
        if (!requestSignal.aborted) {
          setSnapshot(items);
        }
      })
      .catch((error: unknown) => {
        if (!requestSignal.aborted) {
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
  }, [onError, signal]);

  useEffect(() => {
    const controller = new AbortController();
    const requestSignal = signal && AbortSignal.any([controller.signal, signal]);
    if (requestSignal && location.pathname !== '/favorites') {
      void api
        .countFavorites({ signal: requestSignal })
        .then(({ count }) => {
          if (!requestSignal.aborted) {
            setSnapshot((current) => current ?? count);
          }
        })
        .catch((error: unknown) => {
          if (!requestSignal.aborted) {
            onError(error);
          }
        });
    }

    return () => {
      controller.abort();
      listRequest.current?.abort();
      listRequest.current = null;
    };
  }, [onError, signal]);

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
