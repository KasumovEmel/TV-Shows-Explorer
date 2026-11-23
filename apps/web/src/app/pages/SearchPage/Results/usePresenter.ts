import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useSearchPage } from '@/app/pages/SearchPage/search';
import type { ResultsProps } from './types';


export function usePresenter({ search, criteria, isEntering, selectGenre }: ResultsProps) {
  const { t } = useTranslation();
  const { data, isFailed, retry } = useSearchPage({
    criteria: search ? criteria : null,
    signal: search?.signal,
  });
  const [previousGenres, setGenres] = useState<string[]>([]);

  if (data && data.genres !== previousGenres) {
    setGenres(data.genres);
  }

  const selectedGenre = criteria.genre ?? '';
  const genres = new Set(data?.genres ?? previousGenres);
  if (selectedGenre) {
    genres.add(selectedGenre);
  }
  const isGenreListPopulated = genres.size > 0;
  const isLoading = isEntering || (!data && !isFailed);
  const isLoadError = isFailed && !isEntering;
  const isEmpty = !isLoading && data?.items.length === 0;

  return {
    data,
    // The empty option clears the genre filter.
    genreOptions: isGenreListPopulated
      ? ['', ...genres].map((value) => ({
          value,
          isSelected: value === selectedGenre,
          select: () => selectGenre(value),
        }))
      : [],
    isGenreListPopulated,
    isGenreListLoading: isLoading && !isGenreListPopulated,
    isLoading,
    isLoadError,
    isEmpty,
    isGenreSectionVisible: !isLoadError && (!isEmpty || isGenreListPopulated),
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
    retry,
  };
}
