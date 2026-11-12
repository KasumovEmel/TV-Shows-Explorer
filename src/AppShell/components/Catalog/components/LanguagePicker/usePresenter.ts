import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useNotify } from '@shared/components/NotificationProvider';
import { setLanguage } from '@shared/i18n';
import { isLanguage, languageNames, rememberLanguage } from '@shared/i18n/preferences';

import type { Language } from '@shared/i18n/preferences';
import type { ChangeEvent } from 'react';


export function usePresenter() {
  const { i18n, t } = useTranslation();
  const notify = useNotify();
  const [pending, setPending] = useState<Language | null>(null);
  async function select(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (!isLanguage(value)) return;
    setPending(value);
    if (await setLanguage(value)) rememberLanguage(value);
    else notify({ kind: 'error', messageKey: 'language.loadError' });
    setPending(null);
  }
  return {
    label: t('language.label'),
    value: pending ?? i18n.resolvedLanguage,
    disabled: pending !== null,
    select,
    options: Object.entries(languageNames),
  };
}
