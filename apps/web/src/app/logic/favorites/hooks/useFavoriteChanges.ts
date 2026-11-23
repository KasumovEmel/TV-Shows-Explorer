import { useRef } from 'react';

import { addFavorite } from '../tasks/addFavorite';
import { removeFavorite } from '../tasks/removeFavorite';
import * as api from '@/api/generated/catalog';
import { useNotify } from '@/app/notifications';
import type { SaveSelection } from '../types';
import type { FavoriteChanges } from '../types/FavoriteOperations';


export function useFavoriteChanges({ commit, signal, onError }: FavoriteChanges) {
  const queue = useRef({ last: Promise.resolve(), pending: new Set<string>(), signal });
  const notify = useNotify();

  function setSaved({ show, isSaved }: SaveSelection) {
    if (queue.current.signal !== signal) {
      queue.current = { last: Promise.resolve(), pending: new Set<string>(), signal };
    }
    const current = queue.current;
    if (!signal || signal.aborted || current.pending.has(show.id)) {
      return Promise.resolve(false);
    }
    current.pending.add(show.id);

    const change = async () => {
      if (signal.aborted) {
        return false;
      }
      try {
        if (isSaved) {
          await addFavorite({ id: show.id, request: (id) => api.addFavorite(id, { signal }) });
          if (signal.aborted) {
            return false;
          }
          commit((items) => [show, ...items.filter((item) => item.id !== show.id)]);
        } else {
          const remaining = await removeFavorite({
            id: show.id,
            request: (id) => api.removeFavorite(id, { signal }),
          });
          if (signal.aborted) {
            return false;
          }
          commit(() => remaining);
        }
        notify({
          kind: 'success',
          messageKey: isSaved ? 'favorites.added' : 'favorites.removed',
          show,
        });

        return true;
      } catch (error) {
        if (!signal.aborted) {
          onError(error);
        }

        return false;
      } finally {
        current.pending.delete(show.id);
      }
    };

    const result = current.last.then(change);
    current.last = result.then(() => undefined);

    return result;
  }

  return setSaved;
}
