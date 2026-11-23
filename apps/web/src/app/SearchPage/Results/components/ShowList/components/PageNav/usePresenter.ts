import type { MouseEvent } from 'react';

import { useTranslation } from 'react-i18next';

import type { PageNavProps } from './types';


export function usePresenter({ pages, current, jump, isLoading }: PageNavProps) {
  const { t } = useTranslation();
  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => pages <= 5 || n === 1 || n === pages || Math.abs(n - current) <= 1,
  );
  const links = numbers.map((page, i) => ({
    page,
    isGapBeforePage: i > 0 && numbers[i - 1] + 1 < page,
    label: t('catalog.page', { page }),
    href: '#page-' + page,
    isActive: page === current,
    click: (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      jump({ page, isKeyboardNavigation: event.detail === 0 });
    },
  }));

  return { links, isLoading, label: t('catalog.pages') };
}
