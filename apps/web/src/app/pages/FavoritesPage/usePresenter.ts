import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useRemovalRows } from './logic/hooks/useRemovalRows';
import type { FavoritesPageProps } from './types';


export function usePresenter({ favorites }: FavoritesPageProps) {
  const { t } = useTranslation();
  const { items, isFailed, count, refresh } = favorites;

  useEffect(refresh, [refresh]);

  const { rows, remove } = useRemovalRows(favorites);
  const message = isFailed ? 'favorites.failed' : 'favorites.loading';

  return {
    title: t('favorites.title'),
    headingLabel: count === undefined ? undefined : t('favorites.withCount', { count }),
    count,
    rows,
    isFailed,
    remove,
    retry: refresh,
    label: t('catalog.retry'),
    message: t(items && !isFailed ? 'favorites.empty' : message),
  };
}
