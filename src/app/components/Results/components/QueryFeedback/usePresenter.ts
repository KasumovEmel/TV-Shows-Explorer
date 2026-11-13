import { useTranslation } from 'react-i18next';

import type { QueryFeedbackProps } from './types';


const titleKeys = {
  empty: 'catalog.noMatches',
  error: 'catalog.error',
} as const;

export function usePresenter({ state, retry }: QueryFeedbackProps) {
  const { t } = useTranslation();

  const failed = state === 'error';
  const detailKey = failed ? 'catalog.retrySearch' : 'catalog.tryAnother';

  return {
    failed,
    role: failed ? 'alert' : 'status',
    title: t(titleKeys[state]),
    detail: t(detailKey),
    action: t('catalog.retry'),
    retry,
  };
}
