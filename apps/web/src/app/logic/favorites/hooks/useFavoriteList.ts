import { useCallback, useEffect, useRef, useState } from 'react';

import { listFavorites } from '../tasks/listFavorites';
import * as api from '@/api/generated/catalog';
import { runAbortableRequest } from '@/app/utils/runAbortableRequest';
import type {
  FavoriteAccess,
  FavoriteSnapshot,
  UpdateFavorites,
} from '../types/FavoriteOperations';
import type { AbortRequest } from '@/app/types/request.types';


export function useFavoriteList({ signal, onError }: FavoriteAccess) {
  const [snapshot, setSnapshot] = useState<FavoriteSnapshot>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const abortList = useRef<AbortRequest | null>(null);
  const [previous, setPrevious] = useState(signal);
  if (previous !== signal) {
    setPrevious(signal);
    setSnapshot(undefined);
    setIsLoading(false);
    setIsFailed(false);
  }

  const refresh = useCallback(() => {
    if (!signal || signal.aborted || abortList.current) {
      return;
    }
    setIsLoading(true);
    setIsFailed(false);
    abortList.current = runAbortableRequest({
      parentSignal: signal,
      run: (signal) => listFavorites(() => api.listFavorites({ signal })),
      onSuccess: ({ data }) => setSnapshot(data),
      onError: (error) => {
        setIsFailed(true);
        onError(error);
      },
      onSettled: () => {
        abortList.current = null;
        setIsLoading(false);
      },
    }).abort;
  }, [onError, signal]);

  useEffect(() => {
    return () => {
      abortList.current?.();
      abortList.current = null;
    };
  }, [signal]);

  useEffect(() => {
    if (signal && location.pathname !== '/favorites') {
      return runAbortableRequest({
        parentSignal: signal,
        run: (signal) => api.countFavorites({ signal }),
        onSuccess: ({ data }) => setSnapshot((current) => current ?? data.count),
        onError,
      }).abort;
    }
  }, [onError, signal]);

  const commit = useCallback((update: UpdateFavorites) => {
    abortList.current?.();
    abortList.current = null;
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
