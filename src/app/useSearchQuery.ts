import { useEffect, useState } from 'react';

import { behavior } from '@shared/styles/tokens';


export function useSearchQuery() {
  const [value, setValue] = useState('');
  const [committedQuery, setCommittedQuery] = useState<string | null>(null);
  const term = value.trim();

  useEffect(() => {
    if (!term) return;
    const timer = window.setTimeout(() => setCommittedQuery(term), behavior.debounceMs);
    return () => window.clearTimeout(timer);
  }, [term]);

  function onChange(nextValue: string) {
    if (nextValue.trim() !== term) setCommittedQuery(null);
    setValue(nextValue.trim() ? nextValue : '');
  }

  return { value, term, committedQuery, onChange, onSubmit: () => setCommittedQuery(term || null) };
}
