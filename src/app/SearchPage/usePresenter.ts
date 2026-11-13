import { useSearchQuery } from './logic/hooks/useSearchQuery';
import { useSearchTransition } from './logic/hooks/useSearchTransition';

import type { SearchPageProps } from './types';


export function usePresenter({ restored }: SearchPageProps) {
  const { value, term, committedQuery, phase, finishEntrance, onChange, onSubmit } =
    useSearchQuery();

  const docked = phase !== 'idle';

  const { introRef, inputRef, resultsRef } = useSearchTransition(docked, finishEntrance);

  return {
    intro: { restored, introRef, field: { value, onChange, onSubmit, inputRef } },
    results: docked ? { query: committedQuery, entering: phase === 'entering' } : null,
    resultsRef,
    term,
  };
}
