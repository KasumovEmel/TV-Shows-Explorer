import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useSearchPage } from './logic/useSearchPage';
import { useNotify } from '@/app/notifications';
import type { ResultsProps } from './types';


export function usePresenter({ search, criteria, entering, selectGenre }: ResultsProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  const { data, error, mutate, isValidating } = useSearchPage(
    search ? criteria : null,
    search?.signal,
  );
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

  const genre = criteria.genre ?? '';
  const genres = [...new Set([...(data?.genres ?? previousGenres), ...(genre ? [genre] : [])])];
  const chips = genres.length
    ? ['', ...genres].map((value) => ({
        value,
        selected: value === genre,
        select: () => selectGenre(value),
      }))
    : [];
  let feedback: 'empty' | 'filtered' | 'error' | 'loading' | null = null;
  if (entering || !data) {
    feedback = !entering && error && !isValidating ? 'error' : 'loading';
  } else if (!data.totalBeforeFilter) {
    feedback = 'empty';
  } else if (!data.totalAfterFilter) {
    feedback = 'filtered';
  }

  return { data, chips, feedback, genreLabel: t('catalog.genres'), retry: () => void mutate() };
}
