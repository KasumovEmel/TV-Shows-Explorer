import type { MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import { navigateTo } from '@/app/utils/navigateTo';


export function usePresenter() {
  const { t } = useTranslation();

  function navigate(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    navigateTo({ path: e.currentTarget.pathname });
  }

  return { navigate, login: t('auth.login') };
}
