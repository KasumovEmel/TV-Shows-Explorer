import { useTranslation } from 'react-i18next';

import { behavior } from '@/styles/tokens';


export function usePresenter() {
  const { t } = useTranslation();

  return { message: t('catalog.loading'), skeletonCount: behavior.pageSize };
}
