import { useCallback, useEffect, useState } from 'react';

import { behavior } from '@shared/styles/tokens';


export function useSearchQuery() {
  const [value, setValue] = useState('');

  const [committedQuery, setCommittedQuery] = useState<string | null>(null);

  const [phase, setPhase] = useState<'idle' | 'entering' | 'docked'>('idle');

  const finishEntrance = useCallback(() => {
    setPhase((current) => (current === 'entering' ? 'docked' : current));
  }, []);

  const term = value.trim();

  function startSearch(query: string) {
    if (!query) {
      return;
    }
    setCommittedQuery(query);
    setPhase((current) => (current === 'idle' ? 'entering' : current));
  }

  useEffect(() => {
    if (!term) {
      return;
    }
    const timer = window.setTimeout(() => startSearch(term), behavior.debounceMs);

    return () => window.clearTimeout(timer);
  }, [term]);

  function onChange(nextValue: string) {
    if (nextValue.trim() !== term) {
      setCommittedQuery(null);
    }
    if (!nextValue.trim()) {
      setPhase('idle');
    }
    setValue(nextValue.trim() ? nextValue : '');
  }

  return {
    value,
    term,
    committedQuery,
    phase,
    finishEntrance,
    onChange,
    onSubmit: () => startSearch(term),
  };
}
