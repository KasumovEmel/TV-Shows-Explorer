import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { RecoveryScreenProps } from './types';
export function usePresenter(props: RecoveryScreenProps) {
  const { t } = useTranslation();
  const heading = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    heading.current?.focus();
  }, []);
  return {
    ...props,
    heading,
    title: t('recovery.title'),
    description: t('recovery.description'),
    action: t('recovery.restore'),
  };
}
