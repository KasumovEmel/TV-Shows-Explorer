import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { useNotify } from '../../notifications';
import { showsSearchUrl } from './logic/api/fetchShows';
import { filterShows } from './logic/tasks/filterShows';
import { searchShows } from './logic/tasks/searchShows';

import type { ResultsProps } from './types';


export function usePresenter({ search, entering, genre, selectGenre }: ResultsProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  const { data, error, mutate, isValidating } = useSWR(
    search && [showsSearchUrl, search.query],
    search && (() => searchShows(search.query, search.signal)),
    { shouldRetryOnError: false, isPaused: () => search?.signal.aborted === true },
  );
  const stale = Boolean(data && error);

  useEffect(() => {
    if (stale) {
      notify({ kind: 'info' });
    }
  }, [stale, notify]);

  const { cards, genres } = filterShows(data ?? [], genre);
  const chips = genres.length
    ? ['', ...genres].map((value) => ({
        value,
        selected: value === genre,
        select: () => selectGenre(value),
      }))
    : [];
  let feedback: 'empty' | 'filtered' | 'error' | 'loading' | null = null;
  if (data === undefined) {
    feedback = error && !isValidating ? 'error' : 'loading';
  } else if (data.length === 0) {
    feedback = 'empty';
  } else if (cards.length === 0) {
    feedback = 'filtered';
  }

  return {
    cards,
    chips,
    feedback: entering ? ('loading' as const) : feedback,
    genreLabel: t('catalog.genres'),
    retry: () => void mutate(),
  };
}
