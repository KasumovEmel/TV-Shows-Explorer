import { useState } from 'react';

import { useSearchQuery } from './logic/hooks/useSearchQuery';
import { useSearchTransition } from './logic/hooks/useSearchTransition';
import { selectGenre } from '@/app/SearchPage/search';
import type { SearchFilter } from './logic/types/SearchTransition';
import type { SearchPageProps } from './types';


export function usePresenter({ isRestored }: SearchPageProps) {
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

  return {
    intro: { isRestored, introRef, field: { value, onChange, onSubmit, inputRef } },
    results: isDocked
      ? {
          search,
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
