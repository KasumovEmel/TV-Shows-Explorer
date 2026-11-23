import { useTranslation } from 'react-i18next';

import type { ListBoundaryProps } from './types';


export function usePresenter({ isLoading, shown, total }: ListBoundaryProps) {
  const { t } = useTranslation();

  return {
    isLoading,
    source: t('catalog.source'),
    hint: shown < total ? t('catalog.more', { shown, total }) : null,
  };
}
