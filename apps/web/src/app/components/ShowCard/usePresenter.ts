import { useState } from 'react';
import type { MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import { useFavorites } from '@/app/favorites';
import type { ShowCardProps } from './types';


export function usePresenter({ show, animateRemoval }: ShowCardProps) {
  const { t, i18n } = useTranslation();
  const [broken, setBroken] = useState<string>();
  const title = t('titles.' + show.id, { defaultValue: show.originalTitle });
  const rating = show.rating?.toLocaleString(i18n.resolvedLanguage) ?? '-';
  const { items, error, isLoading, pending, toggle } = useFavorites();
  const saved = items?.some((item) => item.id === show.id) ?? false;
  let action = saved ? 'favorites.remove' : 'favorites.add';
  if (!items && error) {
    action = 'favorites.retry';
  }

  return {
    favorite: {
      saved,
      disabled: isLoading || pending || (!items && !error),
      label: t(action, { title }),
      onClick: ({ currentTarget }: MouseEvent<HTMLButtonElement>) =>
        void toggle({
          show,
          animateRemoval:
            animateRemoval && ((update) => animateRemoval({ button: currentTarget, update })),
        }),
    },
    title,
    year: show.year ? t('catalog.premiereYear', { year: show.year }) : t('catalog.noYear'),
    rating,
    ratingLabel: show.rating == null ? t('catalog.noRating') : t('catalog.rating', { rating }),
    summary: show.summary ?? t('catalog.noSummary'),
    genresLabel: t('catalog.genres'),
    genres:
      show.genres.map((g) => t('genres.' + g, { defaultValue: g })).join(', ') ||
      t('catalog.noGenre'),
    poster: show.poster !== broken ? show.poster : undefined,
    onError: () => setBroken(show.poster),
  };
}
