import { useTranslation } from 'react-i18next';

import { useFavorites } from '../favorites';
import { animateFavoriteRemoval } from './logic/utils/animateFavoriteRemoval';


export function usePresenter() {
  const { t } = useTranslation();
  const { items, isFailed, count, retry } = useFavorites();
  const message = isFailed ? 'favorites.failed' : 'favorites.loading';

  return {
    title: t('favorites.title'),
    headingLabel: count === undefined ? undefined : t('favorites.withCount', { count }),
    count,
    items,
    isFailed,
    animateFavoriteRemoval,
    retry,
    label: t('catalog.retry'),
    message: t(items ? 'favorites.empty' : message),
  };
}
