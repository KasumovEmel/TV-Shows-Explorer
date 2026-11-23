import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { changeLanguage } from './logic/tasks/changeLanguage';
import { useNotify } from '@/app/notifications';
import { rememberLanguage, setLanguage } from '@/i18n';


export function usePresenter() {
  const { i18n, t } = useTranslation();
  const notify = useNotify();
  const [isPending, setIsPending] = useState(false);
  const isRussian = i18n.resolvedLanguage === 'ru';
  const next = isRussian ? 'en' : 'ru';

  async function toggle() {
    if (isPending) {
      return;
    }
    setIsPending(true);
    try {
      if (
        !(await changeLanguage({ language: next, apply: setLanguage, remember: rememberLanguage }))
      ) {
        notify({ kind: 'error', messageKey: 'language.loadError' });
      }
    } catch {
      notify({ kind: 'error', messageKey: 'language.loadError' });
    } finally {
      setIsPending(false);
    }
  }

  return { isRussian, toggle: () => void toggle(), isPending, label: t('language.switch') };
}
