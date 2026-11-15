import { useRef, useState } from 'react';

import useSWR from 'swr';

import { addFavorite } from './logic/tasks/addFavorite';
import { listFavorites } from './logic/tasks/listFavorites';
import { removeFavorite } from './logic/tasks/removeFavorite';
import * as api from '@/api/generated/catalog';
import { useRequestError } from '@/app/notifications';
import type { Show } from '@/app/show';


const load = () => listFavorites(api.listFavorites);

export function useFavorites() {
  const { data, error, mutate, isLoading } = useSWR('/api/favorites', load, {
    shouldRetryOnError: false,
  });
  const onError = useRequestError();
  const lock = useRef(false);
  const [pending, setPending] = useState(false);

  async function toggle(show: Show) {
    if (lock.current) {
      return;
    }
    lock.current = true;
    setPending(true);
    try {
      if (!data) {
        await mutate();

        return;
      }
      const saved = data.some((item) => item.id === show.id);
      if (saved) {
        await removeFavorite(show.id, api.removeFavorite);
      } else {
        await addFavorite(show.id, api.addFavorite);
      }
      await mutate(
        (current) => {
          const rest = (current ?? []).filter((item) => item.id !== show.id);

          return saved ? rest : [show, ...rest];
        },
        { revalidate: false },
      );
    } catch (error) {
      onError(error);
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  return {
    items: data,
    error,
    isLoading,
    pending,
    toggle,
    retry: () => void mutate().catch(() => {}),
  };
}
