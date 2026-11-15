import { useTranslation } from 'react-i18next';

import { useFavoritesCount } from '@/app/favorites';


export function usePresenter(favoritesPage: boolean) {
  const { t } = useTranslation();
  const count = useFavoritesCount();

  if (favoritesPage) {
    return { href: '/', icon: 'search' as const, label: t('favorites.search') };
  }

  return {
    href: '/favorites',
    icon: 'heart' as const,
    label: count === undefined ? t('favorites.title') : t('favorites.withCount', { count }),
    count,
  };
}
