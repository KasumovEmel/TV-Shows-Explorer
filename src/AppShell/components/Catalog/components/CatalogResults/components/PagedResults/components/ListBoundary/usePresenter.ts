import { useTranslation } from 'react-i18next';

import type { ListBoundaryProps } from './types';


export function usePresenter({ shown, total }: ListBoundaryProps) {
  const { t } = useTranslation();
  return {
    source: t('catalog.source'),
    label: t(shown === total ? 'catalog.end' : 'catalog.more'),
    progress: t('catalog.progress', { shown, total }),
  };
}
