import { useEffect, useRef, useState } from 'react';

import { addFavorite } from '../tasks/addFavorite';
import { removeFavorite } from '../tasks/removeFavorite';
import { useFavoritesState } from './useFavoritesState';
import * as api from '@/api/generated/catalog';
import { useNotify, useRequestError } from '@/app/notifications';
import type { ToggleFavoriteParams } from '../types/FavoriteOperations';


export function useFavorites() {
  const { items, setItems, count, isFailed, requestList, retry } = useFavoritesState();
  const onError = useRequestError();
  const notify = useNotify();
  const isLocked = useRef(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(requestList, [requestList]);

  async function toggle({ show, animateRemoval }: ToggleFavoriteParams) {
    if (isLocked.current) {
      return;
    }
    isLocked.current = true;
    setIsPending(true);
    try {
      if (!items) {
        retry();

        return;
      }
      const isSaved = items.some((item) => item.id === show.id);
      if (isSaved) {
        await removeFavorite({ id: show.id, request: api.removeFavorite });
      } else {
        await addFavorite({ id: show.id, request: api.addFavorite });
      }
      notify({
        kind: 'success',
        messageKey: isSaved ? 'favorites.removed' : 'favorites.added',
        show,
      });

      async function update() {
        setItems((current) => {
          const rest = (current ?? []).filter((item) => item.id !== show.id);

          return isSaved ? rest : [show, ...rest];
        });
      }

      await (isSaved && animateRemoval ? animateRemoval(update) : update());
    } catch (error) {
      onError(error);
    } finally {
      isLocked.current = false;
      setIsPending(false);
    }
  }

  return {
    items,
    count,
    isFailed,
    isLoading: !items && !isFailed,
    isPending,
    toggle,
    retry,
  };
}
