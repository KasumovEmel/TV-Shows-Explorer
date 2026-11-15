import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { changeLanguage } from './logic/changeLanguage';
import { useNotify } from '@/app/notifications';
import { rememberLanguage } from '@/i18n/languageStorage';
import { setLanguage } from '@/i18n/setLanguage';


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
      if (!(await changeLanguage(next, setLanguage, rememberLanguage))) {
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
