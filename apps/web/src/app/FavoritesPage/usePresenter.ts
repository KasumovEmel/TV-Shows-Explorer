import { useTranslation } from 'react-i18next';

import { useFavorites, useFavoritesCount } from '../favorites';


export function usePresenter() {
  const { t } = useTranslation();
  const { items, error, retry } = useFavorites();
  const count = useFavoritesCount();
  const message = error ? 'favorites.failed' : 'favorites.loading';

  return {
    title: t('favorites.title'),
    headingLabel: count === undefined ? undefined : t('favorites.withCount', { count }),
    count,
    items,
    error,
    retry,
    label: t('catalog.retry'),
    message: t(items ? 'favorites.empty' : message),
  };
}
