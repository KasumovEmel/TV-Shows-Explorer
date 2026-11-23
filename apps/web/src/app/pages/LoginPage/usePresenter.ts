import type { FormEvent } from 'react';

import { useTranslation } from 'react-i18next';

import type { LoginPageProps } from './types';


export function usePresenter({ login }: LoginPageProps) {
  const { t } = useTranslation();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get('email');
    if (typeof email === 'string') {
      login(email);
    }
  }

  return {
    submit,
    title: t('auth.title'),
    emailLabel: t('auth.email'),
    buttonLabel: t('auth.login'),
  };
}
