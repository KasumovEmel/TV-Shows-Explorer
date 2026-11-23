import { useState } from 'react';

import { useSearchQuery } from './logic/hooks/useSearchQuery';
import { useSearchTransition } from './logic/hooks/useSearchTransition';
import { selectGenre } from '@/app/pages/SearchPage/search';
import type { SearchFilter } from './logic/types/SearchTransition';
import type { SearchPageProps } from './types';
import type { Show } from '@/app/types/show.types';


export function usePresenter({ isRestored, favorites }: SearchPageProps) {
  const [filter, setFilter] = useState<SearchFilter>({
    page: 1,
    revision: 0,
  });
  const { value, term, search, phase, finishEntrance, onChange, onSubmit, renew } =
    useSearchQuery();
  const isDocked = phase !== 'idle';
  const { introRef, inputRef, resultsRef } = useSearchTransition({ isDocked, finishEntrance });
  const criteria = { q: term, page: filter.page, genre: filter.genre };

  function chooseGenre(value: string) {
    renew();
    const { genre, page } = selectGenre({ criteria, genre: value });
    setFilter({ genre, page, revision: filter.revision + 1 });
  }

  function cardProps(show: Show) {
    const isSaved = favorites.items?.some((item) => item.id === show.id) ?? false;

    return {
      show,
      isSaved,
      isLoading: favorites.isLoading || (!favorites.items && !favorites.isFailed),
      isFailed: favorites.isFailed,
      onAction: () =>
        favorites.isFailed ? favorites.refresh() : favorites.setSaved({ show, isSaved: !isSaved }),
    };
  }

  return {
    cardProps,
    intro: { isRestored, introRef, field: { value, onChange, onSubmit, inputRef } },
    results: isDocked
      ? {
          search,
          refreshFavorites: favorites.refresh,
          isEntering: phase === 'entering',
          criteria,
          revision: filter.revision,
          selectGenre: chooseGenre,
        }
      : null,
    resultsRef,
    term,
  };
}
