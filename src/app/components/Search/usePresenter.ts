import { useLayoutEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import { useNotify } from '@shared/components/NotificationProvider';

import type { SearchProps } from './types';


export function usePresenter({
  restored,
  value,
  onChange,
  onSubmit,
  theme,
  onToggleTheme,
}: SearchProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  const inputRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (restored) {
      inputRef.current?.focus();
      notify({ kind: 'success' });
    }
  }, [restored, notify]);

  return {
    start: !value,
    label: t('search.label'),
    heading: t('catalog.heading'),
    themeIcon: theme === 'dark' ? ('sun' as const) : ('moon' as const),
    themeLabel: t(theme === 'dark' ? 'theme.toLight' : 'theme.toDark'),
    onToggleTheme,
    field: { value, onChange, onSubmit, inputRef },
  };
}
