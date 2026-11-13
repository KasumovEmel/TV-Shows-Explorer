import { useCallback, useEffect, useState } from 'react';

import { behavior } from '@/styles/tokens';


export function useSearchQuery() {
  const [value, setValue] = useState('');
  const [controller, setController] = useState<AbortController | null>(null);
  const [phase, setPhase] = useState<'idle' | 'entering' | 'docked'>('idle');

  const finishEntrance = useCallback(() => {
    setPhase((current) => (current === 'entering' ? 'docked' : current));
  }, []);

  const term = value.trim();

  const startSearch = useCallback(() => {
    setController((current) => current ?? new AbortController());
    setPhase((current) => (current === 'idle' ? 'entering' : current));
  }, []);

  useEffect(() => () => controller?.abort(), [controller]);

  useEffect(() => {
    if (!term) {
      return;
    }
    const timer = window.setTimeout(startSearch, behavior.debounceMs);

    return () => window.clearTimeout(timer);
  }, [term, startSearch]);

  function onChange(nextValue: string) {
    if (nextValue.trim() !== term) {
      setController(null);
    }
    if (!nextValue.trim()) {
      setPhase('idle');
    }
    setValue(nextValue.trim() ? nextValue : '');
  }

  return {
    value,
    term,
    search: controller ? { query: term, signal: controller.signal } : null,
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
