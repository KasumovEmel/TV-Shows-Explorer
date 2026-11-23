import { useRef } from 'react';

import { addFavorite } from '../tasks/addFavorite';
import { removeFavorite } from '../tasks/removeFavorite';
import * as api from '@/api/generated/catalog';
import { useNotify, useRequestError } from '@/app/notifications';
import type { SaveSelection } from '../types';
import type { CommitFavorites } from '../types/FavoriteOperations';


export function useFavoriteChanges(commit: CommitFavorites) {
  const queue = useRef(Promise.resolve());
  const pending = useRef(new Set<string>());
  const notify = useNotify();
  const onError = useRequestError();

  function setSaved({ show, isSaved }: SaveSelection) {
    if (pending.current.has(show.id)) {
      return Promise.resolve(false);
    }
    pending.current.add(show.id);

    const change = async () => {
      try {
        if (isSaved) {
          await addFavorite({ id: show.id, request: api.addFavorite });
          commit((items) => [show, ...items.filter((item) => item.id !== show.id)]);
        } else {
          const remaining = await removeFavorite({ id: show.id, request: api.removeFavorite });
          commit(() => remaining);
        }
        notify({
          kind: 'success',
          messageKey: isSaved ? 'favorites.added' : 'favorites.removed',
          show,
        });

        return true;
      } catch (error) {
        onError(error);

        return false;
      } finally {
        pending.current.delete(show.id);
      }
    };

    const result = queue.current.then(change);
    queue.current = result.then(() => undefined);

    return result;
  }

  return setSaved;
}
