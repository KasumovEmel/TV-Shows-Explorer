import { useTranslation } from 'react-i18next';

import { useFavoritesState } from '@/app/favorites';


export function usePresenter(isFavoritesPage: boolean) {
  const { t } = useTranslation();
  const { count } = useFavoritesState();

  if (isFavoritesPage) {
    return { href: '/', icon: 'search' as const, label: t('favorites.search') };
  }

  return {
    href: '/favorites',
    icon: 'heart' as const,
    label: count === undefined ? t('favorites.title') : t('favorites.withCount', { count }),
    count,
  };
}
