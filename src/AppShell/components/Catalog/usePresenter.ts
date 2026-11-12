import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useNotify } from '@shared/components/NotificationProvider';
import { behavior } from '@shared/styles/tokens';

import type { CatalogProps } from './types';


export function usePresenter({ restored }: CatalogProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  const [query, setQuery] = useState('');
  const [committed, setCommitted] = useState<string | null>(null);
  const term = query.trim();
  const inputRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (restored) {
      inputRef.current?.focus();
      notify({ kind: 'success' });
    }
  }, [restored, notify]);
  useEffect(() => {
    if (!term) return;
    const timer = window.setTimeout(() => setCommitted(term), behavior.debounceMs);
    return () => window.clearTimeout(timer);
  }, [term]);
  function change(value: string) {
    if (value.trim() !== term) setCommitted(null);
    setQuery(value.trim() ? value : '');
  }
  return {
    t,
    query,
    change,
    inputRef,
    term,
    committed,
    submit: () => setCommitted(term || null),
    start: !term,
  };
}
