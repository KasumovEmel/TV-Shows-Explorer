import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import type { ShowCardProps } from './types';


export function usePresenter({ show }: ShowCardProps) {
  const { t, i18n } = useTranslation();

  const [broken, setBroken] = useState<string>();

  const title = t('titles.' + show.id, { defaultValue: show.originalTitle });
  const rating = show.rating?.toLocaleString(i18n.resolvedLanguage) ?? '-';

  return {
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
