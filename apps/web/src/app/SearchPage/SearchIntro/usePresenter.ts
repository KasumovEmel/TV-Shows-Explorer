import { useId, useLayoutEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { useNotify } from '../../notifications';
import type { SearchIntroProps } from './types';


export function usePresenter({ introRef, restored, field }: SearchIntroProps) {
  const { t } = useTranslation();
  const { inputRef } = field;
  const headingId = useId();
  const notify = useNotify();

  useLayoutEffect(() => {
    if (restored) {
      inputRef.current?.focus();
      notify({ kind: 'success' });
    }
  }, [restored, notify, inputRef]);

  return {
    introRef,
    headingId,
    label: t('search.label'),
    heading: t('catalog.heading'),
    field,
  };
}
