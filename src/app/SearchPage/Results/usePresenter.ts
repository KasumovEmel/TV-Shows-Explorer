import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { useNotify } from '../../notifications';
import { showsSearchUrl } from './logic/api/fetchShows';
import { filterShows } from './logic/tasks/filterShows';
import { searchShows } from './logic/tasks/searchShows';

import type { ResultsProps } from './types';


export function usePresenter({ query, entering }: ResultsProps) {
  const { t } = useTranslation();

  const notify = useNotify();

  const [{ genre, revision }, setFilter] = useState({ genre: '', revision: 0 });

  const { data, error, mutate, isValidating } = useSWR(
    query ? ([showsSearchUrl, query] as const) : null,
    ([, term]) => searchShows(term),
    { shouldRetryOnError: false },
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
        select: () => setFilter((state) => ({ genre: value, revision: state.revision + 1 })),
      }))
    : [];
  let feedback: 'empty' | 'error' | 'loading' | null = null;
  if (data === undefined) {
    feedback = error && !isValidating ? 'error' : 'loading';
  } else if (data.length === 0) {
    feedback = 'empty';
  }

  return {
    cards,
    revision,
    chips,
    feedback: entering ? ('loading' as const) : feedback,
    genreLabel: t('catalog.genres'),
    retry: () => void mutate(),
  };
}
