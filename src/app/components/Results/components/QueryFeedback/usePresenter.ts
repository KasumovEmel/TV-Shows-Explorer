import { useTranslation } from 'react-i18next';

import { behavior } from '@shared/styles/tokens';

import type { QueryFeedbackProps } from './types';


export function usePresenter({ state, retry }: QueryFeedbackProps) {
  const { t } = useTranslation();
  const failed = state === 'error',
    loading = state === 'loading';
  return {
    failed,
    loading,
    skeletonCount: behavior.pageSize,
    role: failed ? 'alert' : 'status',
    title: t(failed ? 'catalog.error' : loading ? 'catalog.loading' : 'catalog.noMatches'),
    detail: loading ? null : t(failed ? 'catalog.checkConnection' : 'catalog.tryAnother'),
    action: t('catalog.retry'),
    retry,
  };
}
