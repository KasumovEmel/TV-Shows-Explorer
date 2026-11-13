import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { fetchShows, showsSearchUrl } from './api/fetchShows';
import { useNotify } from '@shared/components/NotificationProvider';

import type { ResultsProps } from './types';


export function usePresenter({ query }: ResultsProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  const [{ genre, revision }, setFilter] = useState({ genre: '', revision: 0 });
  const { data, error, mutate, isValidating } = useSWR(
    query ? ([showsSearchUrl, query] as const) : null,
    fetchShows,
    { shouldRetryOnError: false },
  );
  const stale = Boolean(data && error);
  useEffect(() => {
    if (stale) {
      notify({ kind: 'info' });
    }
  }, [stale, notify]);
  const genres = [...new Set(data?.flatMap((show) => show.genres))];
  const chips = genres.length
    ? ['', ...genres].map((value) => ({
        value,
        selected: value === genre,
        select: () => setFilter((state) => ({ genre: value, revision: state.revision + 1 })),
      }))
    : [];
  const cards = (data ?? []).filter((show) => !genre || show.genres.includes(genre));
  const feedback: 'empty' | 'error' | 'loading' | null = data?.length
    ? null
    : data
      ? 'empty'
      : error && !isValidating
        ? 'error'
        : 'loading';
  return {
    cards,
    revision,
    chips,
    feedback,
    genreLabel: t('catalog.genres'),
    retry: () => void mutate(),
  };
}
