import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useSearchPage } from './logic/useSearchPage';
import { useNotify } from '@/app/notifications';
import type { ResultsProps } from './types';


export function usePresenter({ search, criteria, entering }: ResultsProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  const { data, error, mutate, isValidating } = useSearchPage({
    criteria: search ? criteria : null,
    signal: search?.signal,
  });
  const [previousGenres, setGenres] = useState<string[]>([]);

  if (data && data.genres !== previousGenres) {
    setGenres(data.genres);
  }
  const stale = Boolean(data && error);

  useEffect(() => {
    if (stale) {
      notify({ kind: 'info' });
    }
  }, [stale, notify]);

  const selectedGenre = criteria.genre ?? '';
  const genres = new Set(data?.genres ?? previousGenres);
  if (selectedGenre) {
    genres.add(selectedGenre);
  }
  const hasGenres = genres.size > 0;
  const isLoading = entering || (!data && (!error || isValidating));
  const loadError = !data && !isLoading ? error : undefined;
  const isEmpty = !isLoading && data?.items.length === 0;

  return {
    data,
    // The empty option clears the genre filter.
    genreOptions: hasGenres ? ['', ...genres] : [],
    hasGenres,
    selectedGenre,
    isLoading,
    loadError,
    isEmpty,
    showGenreSection: !loadError && (!isEmpty || hasGenres),
    genreLabel: t('catalog.genres'),
    emptyCopy: {
      title: t(selectedGenre ? 'catalog.noGenreMatches' : 'catalog.noMatches'),
      hint: t(selectedGenre ? 'catalog.tryAnotherGenre' : 'catalog.tryAnother'),
    },
    errorCopy: {
      title: t('catalog.error'),
      hint: t('catalog.retrySearch'),
      retry: t('catalog.retry'),
    },
    retry: () => void mutate(),
  };
}
