import { useTranslation } from 'react-i18next';

import type { PageSwitcherProps } from './types';


export function usePresenter({ isFavoritesPage, count }: PageSwitcherProps) {
  const { t } = useTranslation();

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
