import { useTranslation } from 'react-i18next';
import type { ChangeEvent } from 'react';
import type { SearchFieldProps } from './types';
export function usePresenter({ value, onChange, inputRef }: SearchFieldProps) {
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
    clear,
    inputRef,
    label: t('search.label'),
    placeholder: t('search.placeholder'),
    clearLabel: t('search.clear'),
  };
}
