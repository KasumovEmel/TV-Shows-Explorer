import { useLayoutEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useNotify } from '@shared/components/NotificationProvider';

import type { CatalogProps } from './types';


export function usePresenter({ restored }: CatalogProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (restored) {
      inputRef.current?.focus();
      notify({ kind: 'success' });
    }
  }, [restored, notify]);
  function change(value: string) {
    setQuery(value);
    setGenre('');
  }
  return { t, query, change, inputRef, genre, setGenre, start: restored && !query.trim() };
}
