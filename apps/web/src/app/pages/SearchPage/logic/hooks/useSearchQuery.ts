import { useCallback, useEffect, useState } from 'react';

import { useAbortScope } from '@/app/logic/hooks/useAbortScope';
import { behavior } from '@/styles/tokens';
import type { SearchPhase } from '../types/SearchTransition';


export function useSearchQuery() {
  const [value, setValue] = useState('');
  const [signal, setSignal] = useState<AbortSignal>();
  const [phase, setPhase] = useState<SearchPhase>('idle');
  const { getSignal, renew, abort } = useAbortScope();

  const finishEntrance = useCallback(() => {
    setPhase((current) => (current === 'entering' ? 'docked' : current));
  }, []);

  const term = value.trim();

  const startSearch = useCallback(() => {
    setSignal(getSignal());
    setPhase((current) => (current === 'idle' ? 'entering' : current));
  }, [getSignal]);

  useEffect(() => {
    if (!term) {
      return;
    }
    const timer = window.setTimeout(startSearch, behavior.debounceMs);

    return () => window.clearTimeout(timer);
  }, [term, startSearch]);

  function onChange(nextValue: string) {
    if (nextValue.trim() !== term) {
      abort();
      setSignal(undefined);
    }
    if (!nextValue.trim()) {
      setPhase('idle');
    }
    setValue(nextValue.trim() ? nextValue : '');
  }

  return {
    value,
    term,
    search: signal ? { query: term, signal } : null,
    renew: () => setSignal(renew()),
    phase,
    finishEntrance,
    onChange,
    onSubmit: () => {
      if (term) {
        startSearch();
      }
    },
  };
}
