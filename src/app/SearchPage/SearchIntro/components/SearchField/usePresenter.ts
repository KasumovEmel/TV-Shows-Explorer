import type { ChangeEvent, SubmitEvent } from 'react';

import { useTranslation } from 'react-i18next';

import type { SearchFieldProps } from './types';


export function usePresenter({ value, onChange, onSubmit, inputRef }: SearchFieldProps) {
  const { t } = useTranslation();

  function clear() {
    onChange('');
    inputRef.current?.focus();
  }

  function change(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return {
    value,
    change,
    submit: (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit();
    },
    clear,
    inputRef,
    label: t('search.label'),
    placeholder: t('search.placeholder'),
    clearLabel: t('search.clear'),
  };
}
