import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import type { ShowCardProps } from './types';


export function usePresenter({ show, isSaved, isLoading, isFailed, onAction }: ShowCardProps) {
  const { t, i18n } = useTranslation();
  const [broken, setBroken] = useState<string>();
  const title = t('titles.' + show.id, { defaultValue: show.originalTitle });
  const rating = show.rating?.toLocaleString(i18n.resolvedLanguage) ?? '-';
  const [isPending, setIsPending] = useState(false);
  const isLocked = useRef(false);
  let action = isSaved ? 'favorites.remove' : 'favorites.add';
  if (isLoading) {
    action = 'favorites.loading';
  }
  if (isFailed) {
    action = 'favorites.retry';
  }

  async function activate(button: HTMLButtonElement) {
    if (isLocked.current) {
      return;
    }
    isLocked.current = true;
    setIsPending(true);
    try {
      await onAction(button);
    } finally {
      isLocked.current = false;
      setIsPending(false);
    }
  }

  return {
    favorite: {
      isSaved: isLoading || isFailed ? undefined : isSaved,
      isLoading,
      isDisabled: isLoading || isPending,
      label: t(action, { title }),
      onClick: ({ currentTarget }: MouseEvent<HTMLButtonElement>) => void activate(currentTarget),
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
