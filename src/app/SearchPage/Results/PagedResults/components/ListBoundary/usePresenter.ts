import { useTranslation } from 'react-i18next';

import type { ListBoundaryProps } from './types';


export function usePresenter({ loading, shown, total }: ListBoundaryProps) {
  const { t } = useTranslation();

  // Figure spaces reserve the counter's width before the response supplies the numbers.
  const counts = loading ? { shown: '\u2007', total: '\u2007\u2007' } : { shown, total };

  return {
    loading,
    source: t('catalog.source'),
    hint: loading || shown < total ? t('catalog.more', counts) : null,
  };
}
