import { useState } from 'react';

import { animateFavoriteRemoval } from '../utils/animateFavoriteRemoval';
import type { RemovingRow } from '../../types';
import type { PageFavorites } from '@/app/logic/favorites';
import type { Show } from '@/app/types/show.types';


export function useRemovalRows({ items, setSaved }: PageFavorites) {
  const [removing, setRemoving] = useState<RemovingRow[]>([]);
  const rows = items?.slice() ?? [];
  // Keep each departing row before its original neighbours until its animation finishes.
  for (const { show, following } of removing) {
    if (rows.some((row) => row.id === show.id)) {
      continue;
    }
    const next = rows.findIndex((row) => following.has(row.id));
    rows.splice(next === -1 ? rows.length : next, 0, show);
  }

  function remove(show: Show) {
    return async (button: HTMLButtonElement) => {
      const index = rows.findIndex((row) => row.id === show.id);
      const following = new Set(rows.slice(index + 1).map((row) => row.id));
      setRemoving((current) => [...current, { show, following }]);

      const finish = () =>
        setRemoving((current) => current.filter((row) => row.show.id !== show.id));

      if (await setSaved({ show, isSaved: false })) {
        await animateFavoriteRemoval({ button, update: finish });
      } else {
        finish();
      }
    };
  }

  return { rows, remove };
}
