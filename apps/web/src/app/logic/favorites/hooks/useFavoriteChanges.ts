import { useRef } from 'react';

import { addFavorite } from '../tasks/addFavorite';
import { removeFavorite } from '../tasks/removeFavorite';
import * as api from '@/api/generated/catalog';
import { useNotify } from '@/app/notifications';
import { runAbortableRequest } from '@/app/utils/runAbortableRequest';
import type { SaveSelection } from '../types';
import type { FavoriteChanges } from '../types/FavoriteOperations';


export function useFavoriteChanges({ commit, signal, onError }: FavoriteChanges) {
  const queue = useRef({ last: Promise.resolve(false), pending: new Set<string>(), signal });
  const notify = useNotify();

  function setSaved({ show, isSaved }: SaveSelection) {
    if (!signal || signal.aborted) {
      return Promise.resolve(false);
    }
    if (queue.current.signal !== signal) {
      queue.current = { last: Promise.resolve(false), pending: new Set<string>(), signal };
    }
    const current = queue.current;
    if (current.pending.has(show.id)) {
      return Promise.resolve(false);
    }
    current.pending.add(show.id);

    function change() {
      return runAbortableRequest({
        parentSignal: signal,
        run: async (signal) => {
          if (isSaved) {
            await addFavorite({ id: show.id, request: (id) => api.addFavorite(id, { signal }) });

            return;
          }

          return removeFavorite({
            id: show.id,
            request: (id) => api.removeFavorite(id, { signal }),
          });
        },
        onSuccess: ({ data: remaining }) => {
          commit((items) => remaining ?? [show, ...items.filter((item) => item.id !== show.id)]);
          notify({
            kind: 'success',
            messageKey: isSaved ? 'favorites.added' : 'favorites.removed',
            show,
          });
        },
        onError,
      }).finished;
    }

    const result = current.last.then(change).finally(() => current.pending.delete(show.id));
    current.last = result.catch(() => false);

    return result;
  }

  return setSaved;
}
