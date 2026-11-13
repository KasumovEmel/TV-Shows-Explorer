import { useTranslation } from 'react-i18next';


export function usePresenter() {
  const { t } = useTranslation();
  return { name: t('brand') };
}
