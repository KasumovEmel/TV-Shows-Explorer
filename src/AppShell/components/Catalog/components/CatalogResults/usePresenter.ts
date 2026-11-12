import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { fetchShows } from './utils/fetchShows';
import { useNotify } from '@shared/components/NotificationProvider';

import type { CatalogResultsProps, Show } from './types';


export function usePresenter({ query, genre, onGenre }: CatalogResultsProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  const { data, error, mutate } = useSWR<Show[], Error>('/shows.json', fetchShows);
  const stale = Boolean(data && error);
  useEffect(() => {
    if (stale) {
      notify({ kind: 'error' });
      notify({ kind: 'info' });
    }
  }, [stale, notify]);
  const search = query.trim().toLowerCase();
  const matches = (data ?? [])
    .map((show) => ({
      ...show,
      title: t(`titles.${show.id}`, { defaultValue: show.originalTitle }),
    }))
    .filter((show) =>
      [show.title, show.originalTitle].some((name) => name.toLowerCase().includes(search)),
    );
  const genres = [...new Set(matches.map((show) => show.genre).filter(Boolean))];
  const cards = matches
    .filter((show) => !genre || show.genre === genre)
    .map((show) => ({ ...show, genre: t(`genres.${show.genre}`, { defaultValue: show.genre }) }));
  const chips = ['', ...genres].map((value) => ({
    value,
    label: value ? t(`genres.${value}`, { defaultValue: value }) : t('catalog.all'),
    selected: value === genre,
    select: () => onGenre(value),
  }));
  return {
    t,
    cards,
    chips,
    hasGenres: genres.length > 0,
    failed: !data && Boolean(error),
    loading: !data && !error,
    retry: () => void mutate(),
    emptyCatalog: data?.length === 0,
    count: t('catalog.count', { count: cards.length }),
  };
}
