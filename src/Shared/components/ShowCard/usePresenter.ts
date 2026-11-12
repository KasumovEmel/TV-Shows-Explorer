import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import type { ShowCardProps } from './types';


export function usePresenter({ show }: ShowCardProps) {
  const { t } = useTranslation();
  const [broken, setBroken] = useState<string>();
  const title = t('titles.' + show.id, { defaultValue: show.originalTitle });
  return {
    title,
    year: show.year ?? t('catalog.noYear'),
    genres:
      show.genres.map((g) => t('genres.' + g, { defaultValue: g })).join(' · ') ||
      t('catalog.noGenre'),
    poster: show.poster !== broken ? show.poster : undefined,
    onError: () => setBroken(show.poster),
  };
}
