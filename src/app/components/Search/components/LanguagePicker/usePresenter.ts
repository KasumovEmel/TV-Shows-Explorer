import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useNotify } from '@shared/components/NotificationProvider';
import { setLanguage } from '@shared/i18n';
import { rememberLanguage } from '@shared/i18n/preferences';


export function usePresenter() {
  const { i18n, t } = useTranslation();

  const notify = useNotify();

  const [pending, setPending] = useState(false);

  const russian = i18n.resolvedLanguage === 'ru';
  const next = russian ? 'en' : 'ru';
  async function toggle() {
    if (pending) {
      return;
    }
    setPending(true);
    try {
      if (await setLanguage(next)) {
        rememberLanguage(next);
      } else {
        notify({ kind: 'error', messageKey: 'language.loadError' });
      }
    } catch {
      notify({ kind: 'error', messageKey: 'language.loadError' });
    } finally {
      setPending(false);
    }
  }

  return { russian, toggle: () => void toggle(), pending, label: t('language.switch') };
}
