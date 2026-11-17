import { useTranslation } from 'react-i18next';

import type { ListBoundaryProps } from './types';


export function usePresenter({ loading, shown, total }: ListBoundaryProps) {
  const { t } = useTranslation();

  return {
    loading,
    source: t('catalog.source'),
    hint: shown < total ? t('catalog.more', { shown, total }) : null,
  };
}
