import { useTranslation } from 'react-i18next';

import { useFavorites } from '../favorites';


export function usePresenter() {
  const { t } = useTranslation();
  const { items, error, retry } = useFavorites();
  const message = error ? 'favorites.failed' : 'favorites.loading';

  return {
    title: t('favorites.title'),
    items,
    error,
    retry,
    label: t('catalog.retry'),
    message: t(items ? 'favorites.empty' : message),
  };
}
