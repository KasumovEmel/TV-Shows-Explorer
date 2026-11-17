import { useRef, useState } from 'react';

import useSWR, { useSWRConfig } from 'swr';

import { addFavorite } from './logic/tasks/addFavorite';
import { listFavorites } from './logic/tasks/listFavorites';
import { removeFavorite } from './logic/tasks/removeFavorite';
import { favoritesCountKey } from './useFavoritesCount';
import * as api from '@/api/generated/catalog';
import { useNotify, useRequestError } from '@/app/notifications';
import type { ToggleFavoriteParams } from './types';


const load = () => listFavorites(api.listFavorites);

export function useFavorites() {
  const { data, error, mutate, isLoading } = useSWR('/api/favorites', load, {
    shouldRetryOnError: false,
  });
  const onError = useRequestError();
  const notify = useNotify();
  const { mutate: refresh } = useSWRConfig();
  const lock = useRef(false);
  const [pending, setPending] = useState(false);

  async function toggle({ show, animateRemoval }: ToggleFavoriteParams) {
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
        await removeFavorite({ id: show.id, request: api.removeFavorite });
      } else {
        await addFavorite({ id: show.id, request: api.addFavorite });
      }
      notify({
        kind: 'success',
        messageKey: saved ? 'favorites.removed' : 'favorites.added',
        show,
      });
      void refresh(favoritesCountKey);

      async function update() {
        await mutate(
          (current) => {
            const rest = (current ?? []).filter((item) => item.id !== show.id);

            return saved ? rest : [show, ...rest];
          },
          { revalidate: false },
        );
      }

      await (saved && animateRemoval ? animateRemoval(update) : update());
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
