import { useTranslation } from 'react-i18next';

import type { QueryFeedbackProps } from './types';


const titleKeys = {
  empty: 'catalog.noMatches',
  filtered: 'catalog.noGenreMatches',
  error: 'catalog.error',
} as const;
const detailKeys = {
  empty: 'catalog.tryAnother',
  filtered: 'catalog.tryAnotherGenre',
  error: 'catalog.retrySearch',
} as const;

export function usePresenter({ state, retry }: QueryFeedbackProps) {
  const { t } = useTranslation();
  const failed = state === 'error';

  return {
    failed,
    role: failed ? 'alert' : 'status',
    title: t(titleKeys[state]),
    detail: t(detailKeys[state]),
    action: t('catalog.retry'),
    retry,
  };
}
