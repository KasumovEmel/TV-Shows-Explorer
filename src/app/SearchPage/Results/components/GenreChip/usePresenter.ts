import { useTranslation } from 'react-i18next';

import type { GenreChipProps } from './types';


export function usePresenter({ value, selected, select }: GenreChipProps) {
  const { t } = useTranslation();

  const label = value ? t('genres.' + value, { defaultValue: value }) : t('catalog.all');

  return { label, selected, select };
}
