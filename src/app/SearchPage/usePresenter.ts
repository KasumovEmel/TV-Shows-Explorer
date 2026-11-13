import { useState } from 'react';

import { useSearchQuery } from './logic/hooks/useSearchQuery';
import { useSearchTransition } from './logic/hooks/useSearchTransition';
import type { SearchPageProps } from './types';


export function usePresenter({ restored }: SearchPageProps) {
  const [{ genre, revision }, setFilter] = useState({ genre: '', revision: 0 });
  const { value, term, search, phase, finishEntrance, onChange, onSubmit } = useSearchQuery();
  const docked = phase !== 'idle';
  const { introRef, inputRef, resultsRef } = useSearchTransition(docked, finishEntrance);

  function selectGenre(value: string) {
    setFilter((state) => ({ genre: value, revision: state.revision + 1 }));
  }

  return {
    intro: { restored, introRef, field: { value, onChange, onSubmit, inputRef } },
    results: docked
      ? { search, entering: phase === 'entering', genre, revision, selectGenre }
      : null,
    resultsRef,
    term,
  };
}
